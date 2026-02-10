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
  deleteCourse,
  pflegefachassistenzCourse,
  courseLevelLabels,
  courseLevelGroups,
  moduleTypeLabels,
  type CourseConfig,
  type CourseLevel,
} from "@/lib/courseConfig"

function CourseCard({
  course,
  onDelete,
}: {
  course: CourseConfig
  onDelete?: (id: string) => void
}) {
  const enabledModules = Object.entries(course.modules)
    .filter(([, cfg]) => cfg.enabled)
    .map(([key]) => moduleTypeLabels[key as keyof typeof moduleTypeLabels])

  const isDefault = course.id === "pflegefachassistenz-default"

  return (
    <Card className="bg-white/90 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">{course.topicName}</CardTitle>
          <Badge variant={isDefault ? "default" : "secondary"}>
            {courseLevelLabels[course.level]}
          </Badge>
        </div>
        <CardDescription>
          {course.pdfFiles.length} PDF-Dateien · {enabledModules.length} Module
          aktiv
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">
            Aktive Module:
          </p>
          <div className="flex flex-wrap gap-1">
            {enabledModules.map((label) => (
              <span
                key={label}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDefault ? (
            <Link
              href="/lernplattform"
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Zur Lernplattform
            </Link>
          ) : (
            <Link
              href="/lernplattform"
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Kurs öffnen
            </Link>
          )}
          {!isDefault && onDelete && (
            <button
              onClick={() => onDelete(course.id)}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Löschen
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function KursePage() {
  const [courses, setCourses] = useState<CourseConfig[]>([])

  useEffect(() => {
    setCourses(getStoredCourses())
  }, [])

  function handleDelete(id: string) {
    deleteCourse(id)
    setCourses(getStoredCourses())
  }

  // Combine hardcoded + user-created courses
  const allCourses = [pflegefachassistenzCourse, ...courses]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="text-center mb-10">
          <Badge className="mb-3">Kursübersicht</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            Lernplattform – Kursübersicht
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Wähle deinen Kurs oder erstelle einen neuen. Die Plattform
            unterstützt Pflegefachassistenz und Pflegefachkraft (Unter-, Mittel-
            und Oberkurs).
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/kurs-erstellen"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              + Neuen Kurs erstellen
            </Link>
            <Link
              href="/"
              className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              Zur Anmeldung
            </Link>
          </div>
        </header>

        {courseLevelGroups.map((group) => {
          const groupCourses = allCourses.filter((c) =>
            (group.levels as string[]).includes(c.level)
          )
          if (groupCourses.length === 0 && group.group === "Pflegefachkraft") {
            // Show empty state for Pflegefachkraft
            return (
              <section key={group.group} className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {group.group}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {group.levels
                    .map(
                      (l) => courseLevelLabels[l as CourseLevel]
                    )
                    .join(" · ")}
                </p>
                <Card className="bg-white/60 border-dashed">
                  <CardContent className="py-8 text-center text-gray-500">
                    <p className="mb-3">
                      Noch keine Kurse für Pflegefachkräfte erstellt.
                    </p>
                    <Link
                      href="/kurs-erstellen"
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Jetzt ersten Kurs erstellen →
                    </Link>
                  </CardContent>
                </Card>
              </section>
            )
          }
          if (groupCourses.length === 0) return null
          return (
            <section key={group.group} className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {group.group}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {group.levels
                  .map((l) => courseLevelLabels[l as CourseLevel])
                  .join(" · ")}
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onDelete={
                      course.id !== "pflegefachassistenz-default"
                        ? handleDelete
                        : undefined
                    }
                  />
                ))}
              </div>
            </section>
          )
        })}

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-3">
            Erstelle neue Kurse für Pflegefachkräfte (Unter-, Mittel-,
            Oberkurs) mit dem Kurs-Ersteller.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/kurs-erstellen"
              className="text-primary hover:underline"
            >
              Kurs erstellen
            </Link>
            <Link href="/lernplattform" className="text-primary hover:underline">
              Zur Lernplattform
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
