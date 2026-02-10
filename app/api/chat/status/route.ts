import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? ""
  const model = process.env.OPENAI_MODEL ?? process.env.NEXT_PUBLIC_OPENAI_MODEL ?? "gpt-4o-mini"

  return NextResponse.json({
    configured: apiKey.length > 0,
    model,
  })
}
