/**
 * Client-side OpenAI API wrapper.
 *
 * Requests are proxied through a server-side API route (/api/chat) so that the
 * OpenAI API key is never exposed to the browser.  The server reads the key
 * from the OPENAI_API_KEY environment variable (falls back to
 * NEXT_PUBLIC_OPENAI_API_KEY for backward compatibility).
 *
 * ChatGPT is used for data extraction from PDFs and content generation,
 * not as a live chat feature.
 */

/* ── configuration ───────────────────────────────────────── */

export const AVAILABLE_MODELS = [
  { id: "gpt-4o-mini", label: "GPT-4o Mini (schnell & günstig)" },
  { id: "gpt-4o", label: "GPT-4o (beste Qualität)" },
  { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo (günstig)" },
] as const

export const DEFAULT_MODEL = "gpt-4o-mini"

/**
 * Returns the OpenAI API key.
 *
 * Only available in server-side contexts where OPENAI_API_KEY is set.
 * Client-side code should use the /api/chat/status endpoint instead.
 */
export function getOpenAIKey(): string {
  return process.env.OPENAI_API_KEY ?? process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? ""
}

/**
 * Returns the selected OpenAI model.
 *
 * On the server, reads from OPENAI_MODEL env var.
 * Client-side code should use the /api/chat/status endpoint instead.
 */
export function getSelectedModel(): string {
  return process.env.OPENAI_MODEL ?? process.env.NEXT_PUBLIC_OPENAI_MODEL ?? DEFAULT_MODEL
}

/**
 * Checks whether an OpenAI API key is configured.
 *
 * Only reliable in server-side contexts. Client-side code should fetch
 * /api/chat/status to determine configuration status.
 */
export function isOpenAIConfigured(): boolean {
  return getOpenAIKey().length > 0
}

/* ── Chat Completion ─────────────────────────────────────── */

export type ChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

export type OpenAIError = {
  message: string
  type?: string
  code?: string
}

export async function chatCompletion(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const temperature = options?.temperature ?? 0.7
  const maxTokens = options?.maxTokens ?? 1024

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, temperature, maxTokens }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const errorMsg =
      (errorBody as { error?: string })?.error ??
      `OpenAI API-Fehler: ${response.status} ${response.statusText}`
    throw new Error(errorMsg)
  }

  const data = await response.json()
  const content = (data as { content?: string })?.content
  if (typeof content !== "string") {
    throw new Error("Unerwartete Antwort von der OpenAI API.")
  }
  return content
}

/* ── Convenience: test the API key ───────────────────────── */

export async function testAPIKey(): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await chatCompletion(
      [{ role: "user", content: "Antworte nur mit: OK" }],
      { temperature: 0, maxTokens: 10 }
    )
    return { ok: result.length > 0 }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
