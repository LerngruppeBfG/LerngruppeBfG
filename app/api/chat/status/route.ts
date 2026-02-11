import { NextResponse } from "next/server"

/**
 * Required for `output: "export"` (GitHub Pages). On server platforms like
 * Vercel the static export is not used, so this route behaves dynamically.
 */
export const dynamic = "force-static"

export async function GET() {
  const provider = (
    process.env.AI_PROVIDER ??
    process.env.NEXT_PUBLIC_AI_PROVIDER ??
    "openai"
  ).toLowerCase() as "openai" | "anthropic"

  let apiKey: string
  let model: string

  if (provider === "anthropic") {
    apiKey = process.env.ANTHROPIC_API_KEY ?? ""
    model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514"
  } else {
    apiKey = process.env.OPENAI_API_KEY ?? process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? ""
    model = process.env.OPENAI_MODEL ?? process.env.NEXT_PUBLIC_OPENAI_MODEL ?? "gpt-4o-mini"
  }

  return NextResponse.json({
    configured: apiKey.length > 0,
    model,
    provider,
  })
}
