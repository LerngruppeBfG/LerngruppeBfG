import { NextResponse } from "next/server"

/**
 * Required for `output: "export"` (GitHub Pages). On server platforms like
 * Vercel the static export is not used, so this route behaves dynamically.
 */
export const dynamic = "force-static"

export async function GET() {
  const openaiKey = process.env.OPENAI_API_KEY ?? process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? ""
  const anthropicKey = process.env.ANTHROPIC_API_KEY ?? ""
  const openaiModel = process.env.OPENAI_MODEL ?? process.env.NEXT_PUBLIC_OPENAI_MODEL ?? "gpt-4o-mini"
  const anthropicModel = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514"

  return NextResponse.json({
    configured: openaiKey.length > 0 || anthropicKey.length > 0,
    openai: { configured: openaiKey.length > 0, model: openaiModel },
    anthropic: { configured: anthropicKey.length > 0, model: anthropicModel },
  })
}
