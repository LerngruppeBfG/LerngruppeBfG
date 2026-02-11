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
} from "@/lib/openaiClient"

export default function KiEinstellungenPage() {
  const [openaiConfigured, setOpenaiConfigured] = useState(false)
  const [anthropicConfigured, setAnthropicConfigured] = useState(false)
  const [openaiModel, setOpenaiModel] = useState("")
  const [anthropicModel, setAnthropicModel] = useState("")
  const [testingOpenai, setTestingOpenai] = useState(false)
  const [testingAnthropic, setTestingAnthropic] = useState(false)
  const [testResultOpenai, setTestResultOpenai] = useState<{
    ok: boolean
    error?: string
  } | null>(null)
  const [testResultAnthropic, setTestResultAnthropic] = useState<{
    ok: boolean
    error?: string
  } | null>(null)

  useEffect(() => {
    fetch("/api/chat/status")
      .then((res) => res.json())
      .then((data: {
        openai?: { configured?: boolean; model?: string }
        anthropic?: { configured?: boolean; model?: string }
      }) => {
        setOpenaiConfigured(data.openai?.configured ?? false)
        setAnthropicConfigured(data.anthropic?.configured ?? false)
        setOpenaiModel(data.openai?.model ?? "gpt-4o-mini")
        setAnthropicModel(data.anthropic?.model ?? "claude-sonnet-4-20250514")
      })
      .catch(() => {
        setOpenaiConfigured(false)
        setAnthropicConfigured(false)
      })
  }, [])

  async function handleTestOpenai() {
    setTestingOpenai(true)
    setTestResultOpenai(null)
    const result = await testAPIKey("openai")
    setTestResultOpenai(result)
    setTestingOpenai(false)
  }

  async function handleTestAnthropic() {
    setTestingAnthropic(true)
    setTestResultAnthropic(null)
    const result = await testAPIKey("anthropic")
    setTestResultAnthropic(result)
    setTestingAnthropic(false)
  }

  const openaiModelLabel = OPENAI_MODELS.find((m) => m.id === openaiModel)?.label ?? openaiModel
  const anthropicModelLabel = ANTHROPIC_MODELS.find((m) => m.id === anthropicModel)?.label ?? anthropicModel

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
        <section className="mb-6 space-y-3">
          <Card
            className={
              openaiConfigured
                ? "bg-emerald-50/80 border-emerald-200"
                : "bg-gray-50/80 border-gray-200"
            }
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{openaiConfigured ? "✅" : "⬜"}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      🟢 OpenAI (ChatGPT)
                    </p>
                    <p className="text-xs text-gray-600">
                      {openaiConfigured
                        ? `Modell: ${openaiModelLabel} · Key: sk-••••••••`
                        : "Nicht konfiguriert"}
                    </p>
                  </div>
                </div>
                {openaiConfigured && (
                  <button
                    onClick={handleTestOpenai}
                    disabled={testingOpenai}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
                  >
                    {testingOpenai ? "…" : "Testen"}
                  </button>
                )}
              </div>
              {testResultOpenai && (
                <div className={`mt-2 rounded-lg p-2 text-xs ${
                  testResultOpenai.ok
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {testResultOpenai.ok ? "✅ Verbindung erfolgreich!" : `❌ ${testResultOpenai.error}`}
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            className={
              anthropicConfigured
                ? "bg-purple-50/80 border-purple-200"
                : "bg-gray-50/80 border-gray-200"
            }
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{anthropicConfigured ? "✅" : "⬜"}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      🟣 Anthropic (Claude)
                    </p>
                    <p className="text-xs text-gray-600">
                      {anthropicConfigured
                        ? `Modell: ${anthropicModelLabel} · Key: sk-ant-••••••••`
                        : "Nicht konfiguriert"}
                    </p>
                  </div>
                </div>
                {anthropicConfigured && (
                  <button
                    onClick={handleTestAnthropic}
                    disabled={testingAnthropic}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
                  >
                    {testingAnthropic ? "…" : "Testen"}
                  </button>
                )}
              </div>
              {testResultAnthropic && (
                <div className={`mt-2 rounded-lg p-2 text-xs ${
                  testResultAnthropic.ok
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {testResultAnthropic.ok ? "✅ Verbindung erfolgreich!" : `❌ ${testResultAnthropic.error}`}
                </div>
              )}
            </CardContent>
          </Card>

          {!openaiConfigured && !anthropicConfigured && (
            <Card className="bg-amber-50/80 border-amber-200">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Kein API-Key konfiguriert</p>
                    <p className="text-xs text-gray-600">Bitte mindestens einen API-Key in der .env.local Datei eintragen.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
                <p className="text-gray-400"># .env.local – Trage einen oder beide Keys ein:</p>
                <p className="mt-2 text-gray-400"># OpenAI (ChatGPT)</p>
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
                <p className="mt-3 text-gray-400"># Anthropic (Claude)</p>
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

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
                <strong>Tipp:</strong> Du kannst beide API-Keys gleichzeitig eintragen.
                Im KI-Assistenten kannst du dann per Knopfdruck zwischen ChatGPT und Claude wechseln!
              </div>

              <p className="text-sm text-gray-600">
                Nach dem Eintragen den Entwicklungsserver neu starten:
              </p>
              <div className="rounded-lg bg-gray-900 p-3 font-mono text-sm text-gray-100">
                <span className="text-gray-400">$ </span>npm run dev
              </div>
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
                  Datei ein und starte den Server neu.
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
                  Datei ein und starte den Server neu.
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
                Setze{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">OPENAI_MODEL</code>{" "}
                bzw.{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">ANTHROPIC_MODEL</code>{" "}
                in der .env.local:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">🟢 OpenAI Modelle</p>
                <div className="space-y-2">
                  {OPENAI_MODELS.map((m) => (
                    <div
                      key={m.id}
                      className={`flex items-center justify-between rounded-lg border p-3 ${
                        openaiModel === m.id && openaiConfigured
                          ? "border-emerald-400 bg-emerald-50/50"
                          : "border-gray-200"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{m.label}</p>
                        <p className="text-xs text-gray-500 font-mono">{m.id}</p>
                      </div>
                      {openaiModel === m.id && openaiConfigured && (
                        <Badge variant="secondary">Aktiv</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">🟣 Anthropic Modelle</p>
                <div className="space-y-2">
                  {ANTHROPIC_MODELS.map((m) => (
                    <div
                      key={m.id}
                      className={`flex items-center justify-between rounded-lg border p-3 ${
                        anthropicModel === m.id && anthropicConfigured
                          ? "border-purple-400 bg-purple-50/50"
                          : "border-gray-200"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{m.label}</p>
                        <p className="text-xs text-gray-500 font-mono">{m.id}</p>
                      </div>
                      {anthropicModel === m.id && anthropicConfigured && (
                        <Badge variant="secondary">Aktiv</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800 space-y-2">
                <p className="font-semibold">💡 Eigenes Modell verwenden?</p>
                <p>
                  Du kannst <strong>jeden beliebigen Modellnamen</strong> in der{" "}
                  <code className="text-xs bg-blue-100 px-1 rounded">.env.local</code> eintragen — auch
                  brandneue Modelle, die hier noch nicht aufgelistet sind:
                </p>
                <div className="rounded bg-gray-900 p-2 font-mono text-xs text-gray-100">
                  <p><span className="text-emerald-400">OPENAI_MODEL</span><span className="text-gray-400">=</span><span className="text-amber-300">gpt-5.2-codex</span></p>
                  <p><span className="text-emerald-400">ANTHROPIC_MODEL</span><span className="text-gray-400">=</span><span className="text-amber-300">claude-opus-4-6</span></p>
                </div>
                <p className="text-xs text-blue-600">
                  Die aktuellen Modellnamen findest du auf{" "}
                  <a href="https://platform.openai.com/docs/models" target="_blank" rel="noopener noreferrer" className="underline font-medium">platform.openai.com/docs/models</a>{" "}
                  und{" "}
                  <a href="https://docs.anthropic.com/en/docs/about-claude/models" target="_blank" rel="noopener noreferrer" className="underline font-medium">docs.anthropic.com/models</a>.
                </p>
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
