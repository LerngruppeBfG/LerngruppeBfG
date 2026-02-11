"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  testAPIKey,
  OPENAI_MODELS,
  ANTHROPIC_MODELS,
  type AIProvider,
} from "@/lib/openaiClient"

export default function KiEinstellungenPage() {
  const [configured, setConfigured] = useState(false)
  const [model, setModel] = useState("")
  const [provider, setProvider] = useState<AIProvider>("openai")
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    ok: boolean
    error?: string
  } | null>(null)
  const [maskedKey, setMaskedKey] = useState("")

  useEffect(() => {
    fetch("/api/chat/status")
      .then((res) => res.json())
      .then((data: { configured?: boolean; model?: string; provider?: AIProvider }) => {
        setConfigured(data.configured ?? false)
        setModel(data.model ?? "")
        setProvider(data.provider ?? "openai")
        if (data.configured) {
          setMaskedKey(data.provider === "anthropic" ? "sk-ant-••••••••" : "sk-••••••••")
        }
      })
      .catch(() => {
        setConfigured(false)
      })
  }, [])

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    const result = await testAPIKey()
    setTestResult(result)
    setTesting(false)
  }

  const allModels = [...OPENAI_MODELS, ...ANTHROPIC_MODELS]
  const modelLabel = allModels.find((m) => m.id === model)?.label ?? model
  const providerLabel = provider === "anthropic" ? "Claude (Anthropic)" : "ChatGPT (OpenAI)"
  const activeModels = provider === "anthropic" ? ANTHROPIC_MODELS : OPENAI_MODELS

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <header className="text-center mb-10">
          <Badge className="mb-3">Einstellungen</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            KI-Einstellungen
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Der KI-API-Key wird in der Projekt-Konfiguration
            (<code className="text-xs bg-gray-100 px-1 rounded">.env.local</code>)
            hinterlegt. Es werden sowohl <strong>OpenAI (ChatGPT)</strong> als auch{" "}
            <strong>Anthropic (Claude)</strong> unterstützt.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/ki-assistent"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Zum KI-Assistenten
            </Link>
            <Link
              href="/ki-quiz"
              className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              Zum KI-Quiz
            </Link>
          </div>
        </header>

        {/* Status */}
        <section className="mb-6">
          <Card
            className={
              configured
                ? "bg-emerald-50/80 border-emerald-200"
                : "bg-amber-50/80 border-amber-200"
            }
          >
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{configured ? "✅" : "⚠️"}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {configured
                      ? `${providerLabel} – API-Key ist konfiguriert`
                      : "Kein API-Key konfiguriert"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {configured
                      ? `Anbieter: ${providerLabel} · Modell: ${modelLabel} · Key: ${maskedKey}`
                      : "Bitte den API-Key in der .env.local Datei eintragen."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Configuration Info */}
        <section className="mb-6">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="text-lg">API-Key konfigurieren</CardTitle>
              <CardDescription>
                Der API-Key wird in der Datei{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">.env.local</code>{" "}
                im Projektverzeichnis gespeichert – nicht im Browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                <p className="text-gray-400"># .env.local – Wähle EINEN Anbieter:</p>
                <p className="mt-2 text-gray-400"># Option A: OpenAI (ChatGPT)</p>
                <p>
                  <span className="text-emerald-400">AI_PROVIDER</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-amber-300">openai</span>
                </p>
                <p>
                  <span className="text-emerald-400">OPENAI_API_KEY</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-amber-300">sk-dein-api-key-hier</span>
                </p>
                <p>
                  <span className="text-emerald-400">OPENAI_MODEL</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-amber-300">gpt-4o-mini</span>
                </p>
                <p className="mt-3 text-gray-400"># Option B: Anthropic (Claude)</p>
                <p>
                  <span className="text-emerald-400">AI_PROVIDER</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-amber-300">anthropic</span>
                </p>
                <p>
                  <span className="text-emerald-400">ANTHROPIC_API_KEY</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-amber-300">sk-ant-dein-api-key-hier</span>
                </p>
                <p>
                  <span className="text-emerald-400">ANTHROPIC_MODEL</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-amber-300">claude-sonnet-4-20250514</span>
                </p>
              </div>

              <p className="text-sm text-gray-600">
                Nach dem Eintragen den Entwicklungsserver neu starten:
              </p>
              <div className="rounded-lg bg-gray-900 p-3 font-mono text-sm text-gray-100">
                <span className="text-gray-400">$ </span>npm run dev
              </div>

              {configured && (
                <div className="flex gap-2">
                  <button
                    onClick={handleTest}
                    disabled={testing}
                    className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {testing ? "Teste…" : "Verbindung testen"}
                  </button>
                </div>
              )}

              {testResult && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    testResult.ok
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {testResult.ok
                    ? "✅ Verbindung erfolgreich! Der API-Key funktioniert."
                    : `❌ Fehler: ${testResult.error}`}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* How to get an API key – OpenAI */}
        <section className="mb-6">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="text-lg">
                🟢 OpenAI API-Key (ChatGPT)
              </CardTitle>
              <CardDescription>
                Du brauchst ein OpenAI-Konto mit API-Guthaben.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
                <li>
                  Gehe zu{" "}
                  <a
                    href="https://platform.openai.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    platform.openai.com
                  </a>{" "}
                  und erstelle ein Konto (oder melde dich an).
                </li>
                <li>
                  Öffne{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    API Keys
                  </a>{" "}
                  in den Einstellungen.
                </li>
                <li>
                  Klicke auf <strong>„Create new secret key"</strong> und kopiere
                  den Key (beginnt mit{" "}
                  <code className="text-xs bg-gray-100 px-1 rounded">sk-</code>).
                </li>
                <li>
                  Lade unter{" "}
                  <a
                    href="https://platform.openai.com/settings/organization/billing/overview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Billing
                  </a>{" "}
                  Guthaben auf (ab $5 USD).
                </li>
                <li>
                  Trage den Key in die{" "}
                  <code className="text-xs bg-gray-100 px-1 rounded">.env.local</code>{" "}
                  ein und setze{" "}
                  <code className="text-xs bg-gray-100 px-1 rounded">AI_PROVIDER=openai</code>.
                </li>
              </ol>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                <strong>Hinweis:</strong> Ein ChatGPT Plus Abo (20 $/Monat) ist
                nicht dasselbe wie API-Guthaben. Für die API brauchst du
                separates Guthaben unter{" "}
                <a
                  href="https://platform.openai.com/settings/organization/billing/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  platform.openai.com/settings/organization/billing
                </a>
                .
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How to get an API key – Claude */}
        <section className="mb-6">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="text-lg">
                🟣 Anthropic API-Key (Claude)
              </CardTitle>
              <CardDescription>
                Du brauchst ein Anthropic-Konto mit API-Guthaben.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
                <li>
                  Gehe zu{" "}
                  <a
                    href="https://console.anthropic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    console.anthropic.com
                  </a>{" "}
                  und erstelle ein Konto (oder melde dich an).
                </li>
                <li>
                  Navigiere zu{" "}
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Settings → API Keys
                  </a>{" "}
                  in der Konsole.
                </li>
                <li>
                  Klicke auf <strong>„Create Key"</strong> und kopiere den Key
                  (beginnt mit{" "}
                  <code className="text-xs bg-gray-100 px-1 rounded">sk-ant-</code>).
                </li>
                <li>
                  Lade unter{" "}
                  <a
                    href="https://console.anthropic.com/settings/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Settings → Billing
                  </a>{" "}
                  Guthaben auf (ab $5 USD).
                </li>
                <li>
                  Trage den Key in die{" "}
                  <code className="text-xs bg-gray-100 px-1 rounded">.env.local</code>{" "}
                  ein und setze{" "}
                  <code className="text-xs bg-gray-100 px-1 rounded">AI_PROVIDER=anthropic</code>.
                </li>
              </ol>
              <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 text-xs text-purple-800">
                <strong>Hinweis:</strong> Ein Claude Pro Abo (20 $/Monat) ist
                nicht dasselbe wie API-Guthaben. Für die API brauchst du
                separates Guthaben unter{" "}
                <a
                  href="https://console.anthropic.com/settings/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  console.anthropic.com/settings/billing
                </a>
                .
              </div>
            </CardContent>
          </Card>
        </section>

        {/* What AI is used for */}
        <section className="mb-6">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="text-lg">Wofür wird die KI genutzt?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                <li>
                  <strong>Datenextraktion:</strong> Inhalte aus den hochgeladenen
                  PDF-Dateien extrahieren und strukturieren.
                </li>
                <li>
                  <strong>Kursinhalte generieren:</strong> Lernkarten, Quizfragen,
                  Lerntabellen und Fragen &amp; Antworten basierend auf den PDFs.
                </li>
                <li>
                  <strong>Fehlende Informationen ergänzen:</strong> Zusätzliches
                  Fachwissen bereitstellen, wenn die PDFs nicht alle Themen
                  abdecken.
                </li>
                <li>
                  <strong>KI-Assistent:</strong> Fragen von Pflegeschülern
                  basierend auf dem Unterrichtsstoff beantworten.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Available Models */}
        <section className="mb-6">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="text-lg">Verfügbare Modelle</CardTitle>
              <CardDescription>
                Aktiver Anbieter: <strong>{providerLabel}</strong>. Setze{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">
                  {provider === "anthropic" ? "ANTHROPIC_MODEL" : "OPENAI_MODEL"}
                </code>{" "}
                in der .env.local auf eines der folgenden Modelle:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeModels.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      model === m.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {m.label}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">{m.id}</p>
                    </div>
                    {model === m.id && (
                      <Badge variant="secondary">Aktiv</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/ki-assistent" className="text-primary hover:underline">
              KI-Assistent
            </Link>
            <Link href="/ki-quiz" className="text-primary hover:underline">
              KI-Quiz
            </Link>
            <Link href="/lernplattform" className="text-primary hover:underline">
              Lernplattform
            </Link>
            <Link href="/" className="text-primary hover:underline">
              Startseite
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
