type DetectionResult = {
  score: number;
  explanation: string;
};

async function postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || "La operación no se pudo completar.");
  }

  return response.json() as Promise<T>;
}

export async function translateText(text: string, targetLang: string) {
  const response = await postJson<{ text: string }>("/api/text/translate", { text, targetLang });
  return response.text;
}

export async function humanizeText(text: string) {
  const response = await postJson<{ text: string }>("/api/text/humanize", { text });
  return response.text;
}

export async function detectAI(text: string) {
  return postJson<DetectionResult>("/api/text/detect", { text });
}
