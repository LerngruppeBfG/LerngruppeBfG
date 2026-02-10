import { NextResponse } from "next/server"

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

/**
 * Required for `output: "export"` (GitHub Pages). The GET handler provides
 * a static fallback; the POST handler remains dynamic on server platforms.
 */
export const dynamic = "force-static"

function getApiKey(): string {
  return process.env.OPENAI_API_KEY ?? process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? ""
}

function getModel(): string {
  return process.env.OPENAI_MODEL ?? process.env.NEXT_PUBLIC_OPENAI_MODEL ?? "gpt-4o-mini"
}

export function GET() {
  return NextResponse.json(
    { error: "POST method required" },
    { status: 405 }
  )
}

export async function POST(request: Request) {
  const apiKey = getApiKey()
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured on the server." },
      { status: 500 }
    )
  }

  let body: {
    messages?: { role: string; content: string }[]
    temperature?: number
    maxTokens?: number
    model?: string
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

  const model = body.model ?? getModel()
  const temperature = body.temperature ?? 0.7
  const maxTokens = body.maxTokens ?? 1024

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: body.messages,
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
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message ?? "Unknown error" },
      { status: 500 }
    )
  }
}
