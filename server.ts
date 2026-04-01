import dotenv from "dotenv";
import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import path from "path";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const PORT = 3000;

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "media-src 'self' blob: https:",
        "connect-src 'self' https://fal.run https://generativelanguage.googleapis.com",
        "font-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
      ].join("; "),
    );
  }
  next();
});

type UsageBucket = {
  videoTimestamps: number[];
  imageTimestamps: number[];
  textTimestamps: number[];
};

const rateLimitStore = new Map<string, UsageBucket>();

const VIDEO_LIMIT = 10;
const IMAGE_LIMIT = 20;
const TEXT_LIMIT = 100;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_TRACKED_CLIENTS = 10000;

const PROHIBITED_KEYWORDS = [
  "nude",
  "naked",
  "porn",
  "sex",
  "gore",
  "violence",
  "blood",
  "kill",
  "murder",
  "hate",
  "racist",
  "hitler",
  "nazi",
  "terrorist",
  "bomb",
  "weapon",
  "drug",
  "ignore previous",
  "system prompt",
  "you are now",
  "act as",
  "bypass",
];

function validatePrompt(prompt: string): { valid: boolean; reason?: string } {
  if (!prompt || prompt.length < 3) {
    return { valid: false, reason: "El prompt es demasiado corto (mínimo 3 caracteres)." };
  }
  if (prompt.length > 1000) {
    return { valid: false, reason: "El prompt es demasiado largo (máximo 1000 caracteres)." };
  }

  const lowerPrompt = prompt.toLowerCase();
  for (const keyword of PROHIBITED_KEYWORDS) {
    if (lowerPrompt.includes(keyword)) {
      return { valid: false, reason: "Contenido no permitido detectado." };
    }
  }

  const injectionPatterns = [
    /ignore.*instructions/i,
    /system.*prompt/i,
    /act.*as.*a/i,
    /you.*are.*now/i,
    /bypass.*filter/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(prompt)) {
      return { valid: false, reason: "Se ha detectado un intento de manipulación del sistema." };
    }
  }

  return { valid: true };
}

function validateTextInput(text: unknown, maxLength = 20000): { valid: boolean; reason?: string } {
  if (typeof text !== "string") {
    return { valid: false, reason: "El texto enviado no es válido." };
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return { valid: false, reason: "El texto no puede estar vacío." };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, reason: `El texto supera el máximo permitido de ${maxLength} caracteres.` };
  }

  return { valid: true };
}

function cleanOldTimestamps(timestamps: number[]) {
  const now = Date.now();
  return timestamps.filter((ts) => now - ts < WINDOW_MS);
}

function pruneRateLimitStore() {
  for (const [key, bucket] of rateLimitStore.entries()) {
    bucket.videoTimestamps = cleanOldTimestamps(bucket.videoTimestamps);
    bucket.imageTimestamps = cleanOldTimestamps(bucket.imageTimestamps);
    bucket.textTimestamps = cleanOldTimestamps(bucket.textTimestamps);

    if (
      bucket.videoTimestamps.length === 0 &&
      bucket.imageTimestamps.length === 0 &&
      bucket.textTimestamps.length === 0
    ) {
      rateLimitStore.delete(key);
    }
  }
}

function getClientKey(req: express.Request) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function getUsageBucket(clientKey: string) {
  pruneRateLimitStore();

  let bucket = rateLimitStore.get(clientKey);
  if (!bucket) {
    if (rateLimitStore.size >= MAX_TRACKED_CLIENTS) {
      throw new Error("Rate limit store capacity reached");
    }
    bucket = { videoTimestamps: [], imageTimestamps: [], textTimestamps: [] };
    rateLimitStore.set(clientKey, bucket);
  }

  bucket.videoTimestamps = cleanOldTimestamps(bucket.videoTimestamps);
  bucket.imageTimestamps = cleanOldTimestamps(bucket.imageTimestamps);
  bucket.textTimestamps = cleanOldTimestamps(bucket.textTimestamps);

  return bucket;
}

function enforceQuota(bucket: UsageBucket, type: "image" | "video" | "text") {
  const now = Date.now();

  if (type === "video") {
    if (bucket.videoTimestamps.length >= VIDEO_LIMIT) {
      return "Has alcanzado el limite diario de generacion de video.";
    }
    bucket.videoTimestamps.push(now);
    return null;
  }

  if (type === "image") {
    if (bucket.imageTimestamps.length >= IMAGE_LIMIT) {
      return "Has alcanzado el limite diario de generacion de imagen.";
    }
    bucket.imageTimestamps.push(now);
    return null;
  }

  if (bucket.textTimestamps.length >= TEXT_LIMIT) {
    return "Has alcanzado el limite diario de operaciones de texto.";
  }
  bucket.textTimestamps.push(now);
  return null;
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return new GoogleGenAI({ apiKey });
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/config", (req, res) => {
  res.json({
    hasFatAiKey: Boolean(process.env.FAT_AI_KEY),
    hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.post("/api/text/translate", async (req, res) => {
  const { text, targetLang } = req.body ?? {};
  const validation = validateTextInput(text);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.reason });
  }
  if (typeof targetLang !== "string" || targetLang.trim().length < 2 || targetLang.trim().length > 40) {
    return res.status(400).json({ error: "El idioma de destino no es válido." });
  }

  try {
    const quotaError = enforceQuota(getUsageBucket(getClientKey(req)), "text");
    if (quotaError) {
      return res.status(429).json({ error: quotaError });
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following text to ${targetLang}. Only return the translated text:\n\n${text}`,
    });

    return res.json({ text: response.text || "" });
  } catch (error: any) {
    console.error(error);
    return res.status(error.message === "Rate limit store capacity reached" ? 503 : 500).json({
      error: "No se pudo traducir el texto.",
    });
  }
});

app.post("/api/text/humanize", async (req, res) => {
  const { text } = req.body ?? {};
  const validation = validateTextInput(text);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.reason });
  }

  try {
    const quotaError = enforceQuota(getUsageBucket(getClientKey(req)), "text");
    if (quotaError) {
      return res.status(429).json({ error: quotaError });
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Rewrite the following text to sound more human, natural, and engaging. Avoid robotic phrasing and maintain the original meaning:\n\n${text}`,
    });

    return res.json({ text: response.text || "" });
  } catch (error: any) {
    console.error(error);
    return res.status(error.message === "Rate limit store capacity reached" ? 503 : 500).json({
      error: "No se pudo humanizar el texto.",
    });
  }
});

app.post("/api/text/detect", async (req, res) => {
  const { text } = req.body ?? {};
  const validation = validateTextInput(text);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.reason });
  }

  try {
    const quotaError = enforceQuota(getUsageBucket(getClientKey(req)), "text");
    if (quotaError) {
      return res.status(429).json({ error: quotaError });
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analiza el siguiente texto y determina si fue generado por IA. Proporciona una puntuación del 0 al 10, donde 10 es definitivamente generado por IA y 0 es definitivamente escrito por un humano. La explicación DEBE estar en español.\n\nTexto: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Puntuacion del 0 al 10" },
            explanation: { type: Type.STRING, description: "Breve explicacion del resultado en espanol" },
          },
          required: ["score", "explanation"],
        },
      },
    });

    if (!response.text) {
      return res.status(502).json({ error: "No hubo respuesta valida del modelo." });
    }

    return res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error(error);
    return res.status(error.message === "Rate limit store capacity reached" ? 503 : 500).json({
      error: "No se pudo analizar el texto.",
    });
  }
});

app.post("/api/generate", async (req, res) => {
  const { type, prompt } = req.body ?? {};

  const validation = validatePrompt(prompt);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.reason });
  }

  if (type !== "image" && type !== "video") {
    return res.status(400).json({ error: "Tipo de generación no válido" });
  }

  try {
    const quotaError = enforceQuota(getUsageBucket(getClientKey(req)), type);
    if (quotaError) {
      return res.status(429).json({ error: quotaError });
    }

    const FAT_AI_KEY = process.env.FAT_AI_KEY;
    if (!FAT_AI_KEY) {
      throw new Error("FAT_AI_KEY is not configured on the server.");
    }

    let resultUrl = "";
    if (type === "image") {
      const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
        method: "POST",
        headers: {
          Authorization: `Key ${FAT_AI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          image_size: "landscape_4_3",
          num_inference_steps: 4,
          sync_mode: true,
        }),
      });
      if (!response.ok) {
        throw new Error("Fal-ai image generation failed");
      }
      const data = await response.json();
      resultUrl = data.images?.[0]?.url || "";
    } else {
      const response = await fetch("https://fal.run/fal-ai/ltx-video", {
        method: "POST",
        headers: {
          Authorization: `Key ${FAT_AI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          resolution: "1080p",
          video_duration: "6",
          aspect_ratio: "16:9",
        }),
      });
      if (!response.ok) {
        throw new Error("Fal-ai video generation failed");
      }
      const data = await response.json();

      if (data.video?.url) {
        resultUrl = data.video.url;
      } else if (data.request_id) {
        resultUrl = await pollVideoResult(data.request_id, "fal-ai/ltx-video", FAT_AI_KEY);
      } else {
        throw new Error("Unexpected response from fal-ai");
      }
    }

    if (!resultUrl) {
      throw new Error("No media URL returned by provider");
    }

    return res.json({ url: resultUrl });
  } catch (error: any) {
    console.error(error);
    return res.status(error.message === "Rate limit store capacity reached" ? 503 : 500).json({
      error: "Error interno del servidor",
    });
  }
});

async function pollVideoResult(requestId: string, modelPath: string, apiKey: string): Promise<string> {
  const maxRetries = 60;
  const delay = 5000;

  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(`https://fal.run/${modelPath}/requests/${requestId}`, {
      headers: {
        Authorization: `Key ${apiKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "COMPLETED" && data.video?.url) {
        return data.video.url;
      }
      if (data.status === "FAILED") {
        throw new Error("Video generation failed on fal-ai");
      }
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("Video generation timed out on fal-ai");
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
