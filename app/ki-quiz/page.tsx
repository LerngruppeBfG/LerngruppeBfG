"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { pdfKnowledge, getTopics, type KnowledgeEntry } from "@/lib/pdfKnowledge"

/* ── Types ────────────────────────────────────────────────── */

type GeneratedQuestion = {
  id: number
  topic: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  source: string
}

/* ── Question generation templates ────────────────────────── */

type QuestionTemplate = {
  build: (entry: KnowledgeEntry) => GeneratedQuestion | null
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

let questionCounter = 0

const templates: QuestionTemplate[] = [
  // Template 1: "Welche Aussage zu [subtopic] ist richtig?"
  {
    build(entry) {
      const sentences = entry.content
        .split(/\.\s+/)
        .filter((s) => s.length > 20 && s.length < 150)
      if (sentences.length < 2) return null

      const correctSentence = sentences[Math.floor(Math.random() * sentences.length)]
      const wrongOptions = generateWrongOptions(entry, correctSentence)
      if (wrongOptions.length < 3) return null

      const options = shuffle([correctSentence + ".", ...wrongOptions.slice(0, 3)])
      const correctIndex = options.indexOf(correctSentence + ".")

      return {
        id: ++questionCounter,
        topic: entry.topic,
        question: `Welche Aussage zu „${entry.subtopic}" ist richtig?`,
        options,
        correctIndex,
        explanation: `Die richtige Antwort stammt aus dem Bereich ${entry.topic} – ${entry.subtopic}.`,
        source: entry.source,
      }
    },
  },
  // Template 2: "Was gehört NICHT zu [subtopic]?"
  {
    build(entry) {
      const keywords = entry.keywords
      if (keywords.length < 2) return null

      const allKeywords = pdfKnowledge
        .filter((e) => e.topic !== entry.topic)
        .flatMap((e) => e.keywords)
      const uniqueWrong = [...new Set(allKeywords)].filter(
        (k) => !keywords.includes(k)
      )
      if (uniqueWrong.length < 1) return null

      const wrongKeyword = uniqueWrong[Math.floor(Math.random() * uniqueWrong.length)]
      const correctKeywords = shuffle(keywords).slice(0, 3)
      const options = shuffle([...correctKeywords, wrongKeyword])
      const correctIndex = options.indexOf(wrongKeyword)

      return {
        id: ++questionCounter,
        topic: entry.topic,
        question: `Welcher Begriff gehört NICHT zum Thema „${entry.subtopic}"?`,
        options,
        correctIndex,
        explanation: `„${wrongKeyword}" gehört nicht zu ${entry.subtopic}, sondern zu einem anderen Fachgebiet.`,
        source: entry.source,
      }
    },
  },
  // Template 3: "Ordne die Information dem richtigen Thema zu"
  {
    build(entry) {
      const snippet = entry.content.substring(0, 100)
      if (snippet.length < 40) return null

      const otherTopics = getTopics().filter((t) => t !== entry.topic)
      if (otherTopics.length < 3) return null

      const wrongTopics = shuffle(otherTopics).slice(0, 3)
      const options = shuffle([entry.topic, ...wrongTopics])
      const correctIndex = options.indexOf(entry.topic)

      return {
        id: ++questionCounter,
        topic: entry.topic,
        question: `Zu welchem Thema gehört folgende Aussage?\n„${snippet}…"`,
        options,
        correctIndex,
        explanation: `Diese Aussage gehört zum Thema ${entry.topic} – ${entry.subtopic}.`,
        source: entry.source,
      }
    },
  },
  // Template 4: "Vervollständige den Satz"
  {
    build(entry) {
      const sentences = entry.content
        .split(/\.\s+/)
        .filter((s) => s.length > 30 && s.length < 120)
      if (sentences.length < 1) return null

      const sentence = sentences[Math.floor(Math.random() * sentences.length)]
      const words = sentence.split(" ")
      if (words.length < 6) return null

      const cutPoint = Math.floor(words.length * 0.6)
      const beginning = words.slice(0, cutPoint).join(" ") + " …"
      const correctEnding = words.slice(cutPoint).join(" ") + "."

      const wrongEndings = generateWrongEndings(entry)
      if (wrongEndings.length < 3) return null

      const options = shuffle([correctEnding, ...wrongEndings.slice(0, 3)])
      const correctIndex = options.indexOf(correctEnding)

      return {
        id: ++questionCounter,
        topic: entry.topic,
        question: `Vervollständige den Satz:\n„${beginning}"`,
        options,
        correctIndex,
        explanation: `Der vollständige Satz lautet: ${sentence}.`,
        source: entry.source,
      }
    },
  },
]

function generateWrongOptions(entry: KnowledgeEntry, correctSentence: string): string[] {
  const otherEntries = pdfKnowledge.filter(
    (e) => e.topic !== entry.topic || e.subtopic !== entry.subtopic
  )
  const candidates = otherEntries
    .flatMap((e) =>
      e.content
        .split(/\.\s+/)
        .filter((s) => s.length > 20 && s.length < 150)
    )
    .filter((s) => s !== correctSentence)

  return shuffle(candidates)
    .slice(0, 3)
    .map((s) => (s.endsWith(".") ? s : s + "."))
}

function generateWrongEndings(entry: KnowledgeEntry): string[] {
  const otherEntries = pdfKnowledge.filter(
    (e) => e.topic !== entry.topic || e.subtopic !== entry.subtopic
  )
  return shuffle(
    otherEntries
      .map((e) => {
        const sentences = e.content.split(/\.\s+/).filter((s) => s.length > 30)
        if (sentences.length === 0) return null
        const sentence = sentences[Math.floor(Math.random() * sentences.length)]
        const words = sentence.split(" ")
        if (words.length < 6) return null
        const cutPoint = Math.floor(words.length * 0.6)
        return words.slice(cutPoint).join(" ") + "."
      })
      .filter(Boolean) as string[]
  ).slice(0, 3)
}

function generateFallbackQuestion(entry: KnowledgeEntry): GeneratedQuestion {
  const keywords = entry.keywords.length > 0 ? entry.keywords : [entry.subtopic]
  const keyword = keywords[Math.floor(Math.random() * keywords.length)]
  const otherTopics = getTopics().filter((t) => t !== entry.topic)
  const wrongTopics = shuffle(otherTopics).slice(0, 3)

  const options = shuffle([entry.topic, ...wrongTopics])
  const correctIndex = options.indexOf(entry.topic)

  return {
    id: ++questionCounter,
    topic: entry.topic,
    question: `Zu welchem Themenbereich gehört der Begriff „${keyword}"?`,
    options,
    correctIndex,
    explanation: `„${keyword}" gehört zum Thema ${entry.topic} – ${entry.subtopic}.`,
    source: entry.source,
  }
}

function generateQuiz(
  count: number,
  topicFilter: string | null
): GeneratedQuestion[] {
  questionCounter = 0
  const entries = topicFilter
    ? pdfKnowledge.filter((e) => e.topic === topicFilter)
    : pdfKnowledge

  const shuffledEntries = shuffle(entries)
  const questions: GeneratedQuestion[] = []

  // First pass: try all templates for each entry
  for (const entry of shuffledEntries) {
    if (questions.length >= count) break

    const shuffledTemplates = shuffle([...templates])
    for (const template of shuffledTemplates) {
      const question = template.build(entry)
      if (question) {
        questions.push(question)
        break
      }
    }
  }

  // Second pass: if still not enough, try remaining entries with all templates
  if (questions.length < count) {
    const usedEntryTopics = new Set(questions.map((q) => `${q.topic}-${q.source}`))
    for (const entry of shuffle(entries)) {
      if (questions.length >= count) break
      const key = `${entry.topic}-${entry.source}`
      if (usedEntryTopics.has(key)) continue

      for (const template of shuffle([...templates])) {
        const question = template.build(entry)
        if (question) {
          questions.push(question)
          usedEntryTopics.add(key)
          break
        }
      }
    }
  }

  // Third pass: generate fallback questions to fill remaining count
  if (questions.length < count) {
    const allEntries = topicFilter
      ? pdfKnowledge.filter((e) => e.topic === topicFilter)
      : pdfKnowledge

    for (const entry of shuffle(allEntries)) {
      if (questions.length >= count) break
      const fallback = generateFallbackQuestion(entry)
      questions.push(fallback)
    }
  }

  return questions
}

/* ── Quiz card component ──────────────────────────────────── */

function KiQuizCard({ quiz }: { quiz: GeneratedQuestion }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">Frage {quiz.id}</CardTitle>
          <Badge variant="secondary">{quiz.topic}</Badge>
        </div>
        <CardDescription className="whitespace-pre-line">
          {quiz.question}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-600">
        <ol className="space-y-1">
          {quiz.options.map((option, index) => {
            let optionClass =
              "flex gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors text-sm"
            if (revealed) {
              if (index === quiz.correctIndex) {
                optionClass += " bg-emerald-100 text-emerald-800"
              } else if (index === selected) {
                optionClass += " bg-red-100 text-red-800"
              }
            } else if (index === selected) {
              optionClass += " bg-primary/10 text-primary ring-1 ring-primary/30"
            } else {
              optionClass += " hover:bg-gray-50"
            }

            return (
              <li
                key={`q${quiz.id}-opt-${index}`}
                className={optionClass}
                onClick={() => {
                  if (!revealed) setSelected(index)
                }}
              >
                <span className="font-semibold text-gray-500 shrink-0">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span>{option}</span>
              </li>
            )
          })}
        </ol>

        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            disabled={selected === null}
            className="w-full rounded-lg border border-dashed border-gray-200 bg-white/80 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {selected === null
              ? "Bitte zuerst eine Antwort auswählen"
              : "Lösung anzeigen"}
          </button>
        )}

        {revealed && (
          <div className="rounded-lg border border-dashed border-gray-200 bg-white/80 p-3">
            <p className="font-medium text-gray-700">
              Richtige Antwort: {String.fromCharCode(65 + quiz.correctIndex)}
            </p>
            {selected !== null && (
              <p
                className={`mt-1 text-xs font-medium ${
                  selected === quiz.correctIndex
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {selected === quiz.correctIndex
                  ? "✓ Richtig!"
                  : "✗ Leider falsch."}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">{quiz.explanation}</p>
            <p className="mt-2 text-xs text-gray-400">Quelle: {quiz.source}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ── Page ──────────────────────────────────────────────────── */

const quizTips = [
  {
    title: "Verständnis statt Auswendiglernen",
    description:
      "Die Fragen werden bei jedem Klick neu generiert – so testest du echtes Verständnis, nicht bloßes Wiedererkennen.",
  },
  {
    title: "Themen gezielt trainieren",
    description:
      "Filtere nach einzelnen Themen, um Schwachstellen gezielt zu üben.",
  },
  {
    title: "Erklärung lesen",
    description:
      "Lies nach jeder Frage die Erklärung und die Quelle. So vertiefst du das Wissen nachhaltig.",
  },
  {
    title: "Neue Fragen generieren",
    description:
      "Klicke auf \u201ENeue Fragen generieren\u201C, um immer wieder frische Fragen zu erhalten.",
  },
]

const DEFAULT_QUESTION_COUNT = 8

export default function KiQuizPage() {
  const topics = getTopics()
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTION_COUNT)
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null)

  useEffect(() => {
    setQuestions(generateQuiz(DEFAULT_QUESTION_COUNT, null))
  }, [])

  const regenerate = useCallback(() => {
    setQuestions(generateQuiz(questionCount, selectedTopic))
    setScore(null)
  }, [questionCount, selectedTopic])

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="text-center mb-10">
          <Badge className="mb-3">KI-Quiz</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            Dynamisch generierte Quizfragen
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Diese Quizfragen werden bei jedem Laden automatisch aus dem
            PDF-Wissen generiert. Keine Frage wiederholt sich exakt – so lernst
            du Verständnis statt Auswendiglernen.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/lernplattform"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Zur Lernplattform
            </Link>
            <Link
              href="/ki-assistent"
              className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              Zum KI-Assistenten
            </Link>
            <Link
              href="/"
              className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              Zur Anmeldung
            </Link>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            So funktioniert das KI-Quiz
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {quizTips.map((tip) => (
              <Card key={tip.title} className="bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                  <CardDescription>{tip.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="text-lg">Quiz konfigurieren</CardTitle>
              <CardDescription>
                Wähle ein Thema und die Anzahl der Fragen. Klicke dann auf
                „Neue Fragen generieren".
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    selectedTopic === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Alle Themen
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
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
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-600">Anzahl Fragen:</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
                >
                  <option value={4}>4 Fragen</option>
                  <option value={8}>8 Fragen</option>
                  <option value={12}>12 Fragen</option>
                  <option value={16}>16 Fragen</option>
                </select>
                <button
                  onClick={regenerate}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                  Neue Fragen generieren
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Deine Quizfragen ({questions.length})
          </h2>
          {questions.length === 0 ? (
            <Card className="bg-white/90">
              <CardContent className="py-8 text-center text-gray-500">
                Keine Fragen für das gewählte Thema generiert. Versuche ein
                anderes Thema oder „Alle Themen".
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {questions.map((q) => (
                <KiQuizCard key={q.id} quiz={q} />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-3">
            Die Quizfragen werden dynamisch aus dem PDF-Wissen generiert. Klicke
            auf „Neue Fragen generieren" für frische Fragen.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/lernplattform" className="text-primary hover:underline">
              Zur Lernplattform
            </Link>
            <Link href="/ki-assistent" className="text-primary hover:underline">
              Zum KI-Assistenten
            </Link>
            <Link href="/kurse" className="text-primary hover:underline">
              Alle Kurse
            </Link>
            <Link href="/lernkarten" className="text-primary hover:underline">
              Lernkarten
            </Link>
            <Link href="/lernquiz" className="text-primary hover:underline">
              Lernquiz
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
