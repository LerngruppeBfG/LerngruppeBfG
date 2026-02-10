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
  getStoredCourses,
  courseLevelLabels,
  type CourseConfig,
  type CourseLevel,
} from "@/lib/courseConfig"

export default function LernplattformAuswahlPage() {
  const [courses, setCourses] = useState<CourseConfig[]>([])

  useEffect(() => {
    setCourses(getStoredCourses())
  }, [])

  const pflegefachkraftLevelConfigs: { level: CourseLevel; label: string; description: string }[] = [
    {
      level: "unterkurs",
      label: "Unterkurs",
      description: "Pflegefachkraft – 1. Ausbildungsjahr",
    },
    {
      level: "mittelkurs",
      label: "Mittelkurs",
      description: "Pflegefachkraft – 2. Ausbildungsjahr",
    },
    {
      level: "oberkurs",
      label: "Oberkurs",
      description: "Pflegefachkraft – 3. Ausbildungsjahr",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="text-center mb-10">
          <Badge className="mb-3">Lernplattform</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            Willkommen auf der Lernplattform
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Wähle deinen Ausbildungsbereich, um auf die passenden Lerninhalte
            zuzugreifen.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pflegefachassistenz */}
          <Link href="/lernplattform">
            <Card className="h-full bg-white/90 transition hover:-translate-y-1 hover:shadow-lg cursor-pointer border-2 border-transparent hover:border-primary/30">
              <CardHeader>
                <div className="text-4xl mb-2">🩺</div>
                <CardTitle className="text-xl">Pflegefachassistenz</CardTitle>
                <CardDescription>
                  Ausbildung zur Pflegefachassistenz – alle Lernmodule, PDFs,
                  Quizfragen und Lernmethoden für deine Prüfungsvorbereitung.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  Zur Lernplattform →
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Pflegefachkraft */}
          <Card className="h-full bg-white/90">
            <CardHeader>
              <div className="text-4xl mb-2">👩‍⚕️</div>
              <CardTitle className="text-xl">Pflegefachkraft</CardTitle>
              <CardDescription>
                Dreijährige Ausbildung zur Pflegefachkraft – unterteilt in
                Unter-, Mittel- und Oberkurs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pflegefachkraftLevelConfigs.map((item) => {
                const levelCourses = courses.filter(
                  (c) => c.level === item.level
                )
                return (
                  <Link
                    key={item.level}
                    href={`/kurse?level=${item.level}`}
                    className="block"
                  >
                    <div className="rounded-lg border border-gray-200 p-3 hover:border-primary/30 hover:bg-primary/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.description}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {levelCourses.length}{" "}
                          {levelCourses.length === 1 ? "Kurs" : "Kurse"}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                )
              })}
              <Link
                href="/kurs-erstellen"
                className="block text-center text-sm text-primary hover:underline mt-2"
              >
                + Neues Thema hinzufügen
              </Link>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="text-primary hover:underline">
              Startseite
            </Link>
            <Link href="/kurse" className="text-primary hover:underline">
              Alle Kurse
            </Link>
            <Link href="/kurs-erstellen" className="text-primary hover:underline">
              Kurs erstellen
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
