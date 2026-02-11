import { NextResponse } from "next/server"

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"

/**
 * Required for `output: "export"` (GitHub Pages). The GET handler provides
 * a static fallback; the POST handler remains dynamic on server platforms.
 */
export const dynamic = "force-static"

type AIProvider = "openai" | "anthropic"

function getOpenAIKey(): string {
  return process.env.OPENAI_API_KEY ?? process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? ""
}

function getAnthropicKey(): string {
  return process.env.ANTHROPIC_API_KEY ?? ""
}

function getOpenAIModel(): string {
  return process.env.OPENAI_MODEL ?? process.env.NEXT_PUBLIC_OPENAI_MODEL ?? "gpt-4o-mini"
}

function getAnthropicModel(): string {
  return process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514"
}

export function GET() {
  return NextResponse.json(
    { error: "POST method required" },
    { status: 405 }
  )
}

export async function POST(request: Request) {
  let body: {
    messages?: { role: string; content: string }[]
    temperature?: number
    maxTokens?: number
    model?: string
    provider?: AIProvider
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return NextResponse.json(
      { error: "Missing or invalid 'messages' field" },
      { status: 400 }
    )
  }

  // Determine provider: explicit in body > auto-detect based on available keys
  let provider: AIProvider = "openai"
  if (body.provider === "anthropic") {
    provider = "anthropic"
  } else if (body.provider === "openai") {
    provider = "openai"
  } else {
    // Auto-detect: prefer OpenAI if both configured, use whichever is available
    if (getOpenAIKey()) provider = "openai"
    else if (getAnthropicKey()) provider = "anthropic"
  }

  const apiKey = provider === "anthropic" ? getAnthropicKey() : getOpenAIKey()
  if (!apiKey) {
    const providerName = provider === "anthropic" ? "Anthropic (Claude)" : "OpenAI (ChatGPT)"
    return NextResponse.json(
      { error: `${providerName} API-Key ist nicht konfiguriert.` },
      { status: 500 }
    )
  }

  const defaultModel = provider === "anthropic" ? getAnthropicModel() : getOpenAIModel()
  const model = body.model ?? defaultModel
  const temperature = body.temperature ?? 0.7
  const maxTokens = body.maxTokens ?? 1024

  try {
    if (provider === "anthropic") {
      return await handleAnthropic(apiKey, model, body.messages, temperature, maxTokens)
    }
    return await handleOpenAI(apiKey, model, body.messages, temperature, maxTokens)
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message ?? "Unknown error" },
      { status: 500 }
    )
  }
}

/** Forward request to OpenAI chat completions API. */
async function handleOpenAI(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  temperature: number,
  maxTokens: number
) {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const errorMsg =
      (errorBody as { error?: { message?: string } })?.error?.message ??
      `OpenAI API error: ${response.status} ${response.statusText}`
    return NextResponse.json({ error: errorMsg }, { status: response.status })
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content

  if (typeof content !== "string") {
    return NextResponse.json(
      { error: "Unexpected response from OpenAI API." },
      { status: 502 }
    )
  }

  return NextResponse.json({ content: content.trim() })
}

/** Forward request to Anthropic messages API. */
async function handleAnthropic(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  temperature: number,
  maxTokens: number
) {
  // Anthropic requires "system" to be passed separately, not in the messages array
  let systemPrompt: string | undefined
  const anthropicMessages = messages
    .filter((m) => {
      if (m.role === "system") {
        systemPrompt = m.content
        return false
      }
      return true
    })
    .map((m) => ({ role: m.role, content: m.content }))

  const requestBody: Record<string, unknown> = {
    model,
    messages: anthropicMessages,
    temperature,
    max_tokens: maxTokens,
  }
  if (systemPrompt) {
    requestBody.system = systemPrompt
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const errorMsg =
      (errorBody as { error?: { message?: string } })?.error?.message ??
      `Anthropic API error: ${response.status} ${response.statusText}`
    return NextResponse.json({ error: errorMsg }, { status: response.status })
  }

  const data = await response.json()
  // Anthropic returns content as an array of content blocks
  const contentBlocks = data?.content
  const textBlock = Array.isArray(contentBlocks)
    ? contentBlocks.find((b: { type: string }) => b.type === "text")
    : null
  const content = textBlock?.text

  if (typeof content !== "string") {
    return NextResponse.json(
      { error: "Unexpected response from Anthropic API." },
      { status: 502 }
    )
  }

  return NextResponse.json({ content: content.trim() })
}
