"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { QuizItem } from "@/components/quiz-item"
import {
  getStoredCourses,
  saveCourse,
  courseLevelLabels,
  type CourseConfig,
} from "@/lib/courseConfig"
import {
  generateCourseContent,
  type ProgressStep,
} from "@/lib/courseContentGenerator"

/* ── Progress feed component ─────────────────────────────── */

function GenerationFeed({
  steps,
  currentIndex,
}: {
  steps: ProgressStep[]
  currentIndex: number
}) {
  const total = steps.length
  const done = steps.filter((s) => s.done).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Card className="bg-white/90 max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="text-5xl mb-2">⚙️</div>
        <CardTitle className="text-xl">Kursinhalte werden erstellt…</CardTitle>
        <CardDescription>
          Die Lerninhalte werden aus deinen PDF-Themen generiert. Das dauert
          einen Moment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 font-medium">
          {pct}% abgeschlossen
        </p>

        {/* step feed */}
        <ul className="space-y-2">
          {steps.map((step, idx) => (
            <li
              key={idx}
              className={`flex items-center gap-2 text-sm transition-colors ${
                step.done
                  ? "text-gray-700"
                  : idx === currentIndex + 1
                  ? "text-primary font-medium"
                  : "text-gray-400"
              }`}
            >
              <span>
                {step.done ? "✅" : idx === currentIndex + 1 ? "⏳" : "⬜"}
              </span>
              {step.label}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

/* ── Inner detail component (needs searchParams) ─────────── */

function KursDetailInner() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get("id")

  const [course, setCourse] = useState<CourseConfig | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genSteps, setGenSteps] = useState<ProgressStep[]>([])
  const [genIndex, setGenIndex] = useState(-1)
  const generatingRef = useRef(false)

  /* Load course from localStorage */
  useEffect(() => {
    if (!courseId) {
      setNotFound(true)
      return
    }
    const stored = getStoredCourses()
    const found = stored.find((c) => c.id === courseId)
    if (found) {
      setCourse(found)
    } else {
      setNotFound(true)
    }
  }, [courseId])

  /* Auto-generate content when course has none */
  const startGeneration = useCallback(async (c: CourseConfig) => {
    if (generatingRef.current) return
    generatingRef.current = true
    setGenerating(true)

    // Check if AI is available server-side
    let useAI = false
    try {
      const res = await fetch("/api/chat/status")
      const data = await res.json()
      useAI = data.configured ?? false
    } catch (err) {
      console.warn("Failed to check AI status:", err)
    }

    try {
      const content = await generateCourseContent(c, (steps, idx) => {
        setGenSteps([...steps])
        setGenIndex(idx)
      }, useAI)

      const updated: CourseConfig = {
        ...c,
        generatedContent: content,
        generationStatus: "done",
      }
      saveCourse(updated)
      setCourse(updated)
    } catch {
      const updated: CourseConfig = { ...c, generationStatus: "error" }
      saveCourse(updated)
      setCourse(updated)
    } finally {
      setGenerating(false)
      generatingRef.current = false
    }
  }, [])

  useEffect(() => {
    if (course && !course.generatedContent && !generating) {
      startGeneration(course)
    }
  }, [course, generating, startGeneration])

  /* ── Rendering ──────────────────────────────────────────── */

  if (notFound) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Kurs nicht gefunden
          </h1>
          <p className="text-gray-600">
            Der Kurs existiert nicht oder wurde gelöscht.
          </p>
          <Link
            href="/kurse"
            className="inline-block px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
          >
            Zur Kursübersicht
          </Link>
        </div>
      </main>
    )
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <p className="text-gray-500">Lade Kurs…</p>
      </main>
    )
  }

  if (generating || !course.generatedContent) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <header className="text-center mb-8">
            <Badge className="mb-3">{courseLevelLabels[course.level]}</Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {course.topicName}
            </h1>
          </header>
          <GenerationFeed steps={genSteps} currentIndex={genIndex} />
        </div>
      </main>
    )
  }

  if (course.generationStatus === "error") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Fehler bei der Inhaltserstellung
          </h1>
          <p className="text-gray-600">
            Die Inhalte konnten nicht generiert werden. Bitte versuche es
            erneut.
          </p>
          <button
            onClick={() => startGeneration(course)}
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </main>
    )
  }

  const content = course.generatedContent

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-10">
          <Badge className="mb-3">{courseLevelLabels[course.level]}</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            {course.topicName}
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Lerninhalte basierend auf {course.pdfFiles.length} PDF-Dateien.
            Erstellt am{" "}
            {new Date(content.generatedAt).toLocaleString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            .
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/kurse"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Alle Kurse
            </Link>
            <button
              onClick={() => {
                const reset: CourseConfig = {
                  ...course,
                  generatedContent: undefined,
                  generationStatus: "idle",
                }
                saveCourse(reset)
                setCourse(reset)
              }}
              className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              Inhalte neu generieren
            </button>
          </div>
        </header>

        {/* PDF list */}
        <section className="mb-12">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-2xl">PDF-Dateien</CardTitle>
              <CardDescription>
                {course.pdfFiles.length} PDF-Dateien bilden die Grundlage
                dieses Kurses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {course.pdfFiles.map((pdf) => (
                  <span
                    key={pdf}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                  >
                    📄 {pdf}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Learning Fields */}
        {content.learningFields.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Lernfelder
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {content.learningFields.map((field) => (
                <Card key={field.title} className="bg-white/80">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-xl">{field.title}</CardTitle>
                      <Badge variant="secondary">Lernfeld</Badge>
                    </div>
                    <CardDescription>{field.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Lernziele
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                        {field.goals.map((goal) => (
                          <li key={goal}>{goal}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Zugehörige PDFs
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {field.documents.map((doc) => (
                          <span
                            key={doc}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                          >
                            📄 {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Flashcards */}
        {content.flashcards.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Lernkarten
            </h2>
            <p className="text-sm text-gray-600 mb-4 max-w-3xl">
              Lies zuerst die Frage, beantworte sie laut und klappe danach die
              Antwort auf.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {content.flashcards.map((card) => (
                <Card key={card.title} className="bg-white/80">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <Badge variant="outline">Lernkarte</Badge>
                    </div>
                    <CardDescription>{card.question}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-600">
                    <details className="rounded-lg border border-dashed border-gray-200 bg-white/80 p-3">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700">
                        Antwort anzeigen
                      </summary>
                      <p className="mt-2">{card.answer}</p>
                      <p className="mt-2 text-xs text-gray-500">{card.tip}</p>
                      <p className="mt-2 text-xs text-gray-400">
                        Quelle: {card.source}
                      </p>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Quiz */}
        {content.quizItems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Lernquiz
            </h2>
            <p className="text-sm text-gray-600 mb-4 max-w-3xl">
              Kreuze deine Antwort an und klappe die Lösung auf.
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              {content.quizItems.map((quiz) => (
                <QuizItem
                  key={quiz.title}
                  title={quiz.title}
                  question={quiz.question}
                  options={quiz.options}
                  answer={quiz.answer}
                  explanation={quiz.explanation}
                />
              ))}
            </div>
          </section>
        )}

        {/* Tables */}
        {content.tables.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Lerntabellen
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {content.tables.map((table) => (
                <Card key={table.title} className="bg-white/80">
                  <CardHeader>
                    <CardTitle className="text-lg">{table.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            {table.headers.map((h) => (
                              <th
                                key={h}
                                className="border-b border-gray-200 px-3 py-2 text-left font-medium text-gray-700"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, ri) => (
                            <tr key={ri}>
                              {table.headers.map((h) => (
                                <td
                                  key={h}
                                  className="border-b border-gray-100 px-3 py-2 text-gray-600"
                                >
                                  {row[h] || "–"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Quick Q&A */}
        {content.quickQuestions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Fragen &amp; Antworten
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {content.quickQuestions.map((item) => (
                <details
                  key={item.question}
                  className="rounded-lg border border-gray-200 bg-white/80 p-4"
                >
                  <summary className="cursor-pointer text-sm font-semibold text-gray-800">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/kurse" className="text-primary hover:underline">
              Alle Kurse
            </Link>
            <Link
              href="/kurs-erstellen"
              className="text-primary hover:underline"
            >
              Kurs erstellen
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

/* ── Page wrapper with Suspense for useSearchParams ──────── */

import { Suspense } from "react"

export default function KursDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
          <p className="text-gray-500">Lade Kurs…</p>
        </main>
      }
    >
      <KursDetailInner />
    </Suspense>
  )
}
