"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { searchKnowledge, getTopics, getEntriesByTopic, pdfKnowledge, type KnowledgeEntry } from "@/lib/pdfKnowledge"
import { isOpenAIConfigured, chatCompletion, type ChatMessage } from "@/lib/openaiClient"

type Message = {
  role: "user" | "assistant"
  text: string
  sources?: string[]
}

const suggestedQuestions = [
  "Was ist eine Thrombose?",
  "Erkläre die Virchow-Trias.",
  "Was sind die Symptome einer Hypoglykämie?",
  "Welche Wundheilungsphasen gibt es?",
  "Was ist bei Fieber zu tun?",
  "Wie funktioniert der Insulin-PEN?",
  "Was sind die DGE-Regeln?",
  "Was ist eine Lungenembolie?",
  "Erkläre primäre vs. sekundäre Wundheilung.",
  "Welche Spätfolgen hat Diabetes?",
]

const features = [
  {
    title: "Stoffbezogene Antworten",
    description:
      "Der KI-Assistent durchsucht die Inhalte aller hochgeladenen PDFs und beantwortet deine Fragen basierend auf dem Unterrichtsstoff.",
  },
  {
    title: "Quellenangaben",
    description:
      "Jede Antwort enthält Quellenverweise zu den PDFs, damit du die Informationen jederzeit nachschlagen kannst.",
  },
  {
    title: "Themen-Explorer",
    description:
      "Erkunde alle Themengebiete auf einen Blick und lass dir Zusammenfassungen zu einzelnen Bereichen generieren.",
  },
  {
    title: "Lernhilfe & Erklärungen",
    description:
      "Stell komplexe Fragen in eigenen Worten – der Assistent erklärt dir die Zusammenhänge verständlich.",
  },
]

function buildLocalAnswer(query: string): Message {
  const results = searchKnowledge(query)

  if (results.length === 0) {
    return {
      role: "assistant",
      text: "Leider konnte ich zu deiner Frage keine passenden Informationen in den Unterlagen finden. Versuche es mit anderen Stichwörtern oder schau in der Themenübersicht nach.",
      sources: [],
    }
  }

  const topResults = results.slice(0, 3)
  const answerParts = topResults.map(
    (entry) => `**${entry.topic} – ${entry.subtopic}:**\n${entry.content}`
  )
  const sources = Array.from(new Set(topResults.map((e) => e.source)))

  return {
    role: "assistant",
    text: answerParts.join("\n\n"),
    sources,
  }
}

/** Build a system prompt that includes all PDF knowledge for context. */
function buildSystemPrompt(): string {
  const knowledgeContext = pdfKnowledge
    .map(
      (e) =>
        `[${e.topic} – ${e.subtopic}] (Quelle: ${e.source})\n${e.content}`
    )
    .join("\n\n")

  return `Du bist ein hilfreicher KI-Lernassistent für Pflegeschüler. Du kennst den Inhalt aller hochgeladenen Unterrichts-PDFs und antwortest basierend auf diesem Wissen.

Antworte immer auf Deutsch. Gib am Ende deiner Antwort die genutzten Quellen an (PDF-Namen).

Hier sind die Unterrichtsinhalte aus den PDFs:

${knowledgeContext}`
}

async function buildOpenAIAnswer(
  query: string,
  conversationHistory: Message[]
): Promise<Message> {
  const systemPrompt = buildSystemPrompt()

  // Keep last 6 messages as context window to stay within token limits
  const recentMessages = conversationHistory.slice(-6)
  const apiMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...recentMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.text,
    })),
    { role: "user" as const, content: query },
  ]

  try {
    const response = await chatCompletion(apiMessages, {
      temperature: 0.7,
      maxTokens: 1024,
    })

    // Try to extract source references from the response
    const results = searchKnowledge(query)
    const sources = Array.from(
      new Set(results.slice(0, 3).map((e) => e.source))
    )

    return {
      role: "assistant",
      text: response,
      sources,
    }
  } catch (err) {
    const fallback = buildLocalAnswer(query)
    return {
      role: "assistant",
      text: `⚠️ OpenAI-Fehler: ${(err as Error).message}\n\nIch nutze stattdessen den lokalen Wissens-Modus:\n\n${fallback.text}`,
      sources: fallback.sources,
    }
  }
}

function TopicExplorer() {
  const topics = getTopics()
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [entries, setEntries] = useState<KnowledgeEntry[]>([])

  function handleTopicClick(topic: string) {
    if (selectedTopic === topic) {
      setSelectedTopic(null)
      setEntries([])
    } else {
      setSelectedTopic(topic)
      setEntries(getEntriesByTopic(topic))
    }
  }

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-lg">Themen-Explorer</CardTitle>
        <CardDescription>
          Klicke auf ein Thema, um alle verfügbaren Inhalte zu sehen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicClick(topic)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedTopic === topic
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
        {selectedTopic && entries.length > 0 && (
          <div className="space-y-3 mt-4">
            <h3 className="text-base font-semibold text-gray-800">
              {selectedTopic} – {entries.length} Einträge
            </h3>
            {entries.map((entry, i) => (
              <details
                key={`${entry.subtopic}-${i}`}
                className="rounded-lg border border-gray-200 bg-white/80 p-3"
              >
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  {entry.subtopic}
                </summary>
                <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                  {entry.content}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Quelle: {entry.source}
                </p>
              </details>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function KiAssistentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hallo! Ich bin dein KI-Lernassistent. Ich kenne den Inhalt aller PDFs aus deinem Unterricht. Stell mir eine Frage zu Thrombose, Diabetes, Wunden, Ernährung oder Fieber – ich helfe dir beim Lernen!",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [useAI, setUseAI] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    setUseAI(isOpenAIConfigured())
  }, [])

  async function handleSend(question?: string) {
    const q = question ?? input.trim()
    if (!q) return

    const userMessage: Message = { role: "user", text: q }
    setInput("")

    if (useAI) {
      setMessages((prev) => [...prev, userMessage])
      setLoading(true)
      const answer = await buildOpenAIAnswer(q, [...messages, userMessage])
      setMessages((prev) => [...prev, answer])
      setLoading(false)
    } else {
      const answer = buildLocalAnswer(q)
      setMessages((prev) => [...prev, userMessage, answer])
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSummary() {
    const topics = getTopics()
    const summary = topics
      .map((topic) => {
        const entries = getEntriesByTopic(topic)
        const subtopics = entries.map((e) => e.subtopic).join(", ")
        return `**${topic}:** ${subtopics}`
      })
      .join("\n\n")

    setMessages((prev) => [
      ...prev,
      { role: "user", text: "Gib mir eine Zusammenfassung aller Themen." },
      {
        role: "assistant",
        text: `Hier ist eine Übersicht aller verfügbaren Themen und Unterthemen:\n\n${summary}`,
        sources: [],
      },
    ])
  }

  function handleExamPrep() {
    const allEntries = getTopics().flatMap((t) => getEntriesByTopic(t))
    const shuffled = [...allEntries].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 5)

    const questions = selected.map(
      (entry, i) =>
        `**Frage ${i + 1} (${entry.topic}):** Erkläre kurz: ${entry.subtopic}. Was sind die wichtigsten Punkte?`
    )

    setMessages((prev) => [
      ...prev,
      { role: "user", text: "Stelle mir Klausur-Übungsfragen." },
      {
        role: "assistant",
        text: `Hier sind 5 zufällige Übungsfragen aus deinem Stoff. Beantworte sie laut oder schriftlich und nutze dann den Themen-Explorer, um deine Antworten zu prüfen:\n\n${questions.join("\n\n")}`,
        sources: [],
      },
    ])
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="text-center mb-10">
          <Badge className="mb-3">KI-Assistent</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            Lernen mit KI
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Dein intelligenter Lernassistent kennt alle Inhalte aus den
            Unterrichts-PDFs. Stelle Fragen, lass dir Themen erklären oder
            bereite dich gezielt auf die Klausur vor.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/lernplattform"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Zur Lernplattform
            </Link>
            <Link
              href="/ki-quiz"
              className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              Zum KI-Quiz
            </Link>
            <Link
              href="/ki-einstellungen"
              className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              ⚙️ KI-Einstellungen
            </Link>
            <Link
              href="/"
              className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              Zur Anmeldung
            </Link>
          </div>
          {/* AI Mode Indicator */}
          <div className="mt-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                useAI
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${useAI ? "bg-emerald-500" : "bg-gray-400"}`} />
              {useAI ? "ChatGPT-Modus aktiv" : "Lokaler Wissens-Modus"}
            </span>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Was kann der KI-Assistent?
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((f) => (
              <Card key={f.title} className="bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <Card className="bg-white/90">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">Chat mit dem KI-Assistenten</CardTitle>
                <div className="flex gap-2">
                  <button
                    onClick={handleSummary}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    Zusammenfassung
                  </button>
                  <button
                    onClick={handleExamPrep}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    Klausur-Übung
                  </button>
                </div>
              </div>
              <CardDescription>
                Stelle eine Frage oder nutze die Vorschläge unten.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-80 overflow-y-auto space-y-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-2 text-sm whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-white border border-gray-200 text-gray-700"
                      }`}
                    >
                      {msg.text}
                      {msg.sources && msg.sources.length > 0 && (
                        <p className="mt-2 text-xs opacity-70 border-t border-gray-100 pt-1">
                          📄 Quellen: {msg.sources.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-lg px-4 py-2 text-sm bg-white border border-gray-200 text-gray-500">
                      ChatGPT denkt nach…
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Stelle eine Frage zum Unterrichtsstoff…"
                  disabled={loading}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "…" : "Senden"}
                </button>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Beispielfragen:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <TopicExplorer />
        </section>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-3">
            Der KI-Assistent basiert auf den PDFs aus dem Ordner
            <span className="font-semibold"> /pdf-uploads</span>. Je mehr
            Unterlagen vorhanden sind, desto besser werden die Antworten.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/lernplattform" className="text-primary hover:underline">
              Zur Lernplattform
            </Link>
            <Link href="/ki-quiz" className="text-primary hover:underline">
              Zum KI-Quiz
            </Link>
            <Link href="/ki-einstellungen" className="text-primary hover:underline">
              KI-Einstellungen
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
