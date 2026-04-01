/**
 * fat.ai API service for image and video generation.
 * This service handles requests to the backend which enforces rate limits.
 */

type ServerConfig = {
  hasFatAiKey: boolean;
  hasGeminiApiKey: boolean;
};

export async function getServerConfig(): Promise<ServerConfig> {
  const response = await fetch("/api/config");
  if (!response.ok) {
    throw new Error("No se pudo comprobar la configuración del servidor");
  }
  return response.json();
}

export async function generateImageFat(prompt: string) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "image",
      prompt: prompt,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate image via backend");
  }

  const data = await response.json();
  return data.url;
}

export async function generateVideoFat(prompt: string) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "video",
      prompt: prompt,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate video via backend");
  }

  const data = await response.json();
  return data.url;
}
