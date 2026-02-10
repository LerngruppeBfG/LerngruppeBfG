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

const DELETE_PASSWORD = "admin123"

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
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [levelFilter, setLevelFilter] = useState<string | null>(null)

  useEffect(() => {
    setCourses(getStoredCourses())
    // Read level filter from URL query parameter
    const params = new URLSearchParams(window.location.search)
    const level = params.get("level")
    if (level) {
      setLevelFilter(level)
    }
  }, [])

  function requestDelete(id: string) {
    setDeleteTarget(id)
    setDeletePassword("")
    setDeleteError("")
  }

  function confirmDelete() {
    if (deletePassword !== DELETE_PASSWORD) {
      setDeleteError("Falsches Passwort. Löschen nicht möglich.")
      return
    }
    if (deleteTarget) {
      deleteCourse(deleteTarget)
      setCourses(getStoredCourses())
      setDeleteTarget(null)
      setDeletePassword("")
      setDeleteError("")
    }
  }

  function cancelDelete() {
    setDeleteTarget(null)
    setDeletePassword("")
    setDeleteError("")
  }

  // Combine hardcoded + user-created courses
  const allCourses = [pflegefachassistenzCourse, ...courses]
  const filteredCourses = levelFilter
    ? allCourses.filter((c) => c.level === levelFilter)
    : allCourses

  const filterLabel = levelFilter
    ? courseLevelLabels[levelFilter as CourseLevel] || levelFilter
    : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="text-center mb-10">
          <Badge className="mb-3">Kursübersicht</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            {filterLabel
              ? `${filterLabel} – Kurse`
              : "Lernplattform – Kursübersicht"}
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            {filterLabel
              ? `Hier findest du alle Kurse für ${filterLabel}. Erstelle neue Themen oder öffne bestehende.`
              : "Wähle deinen Kurs oder erstelle einen neuen. Die Plattform unterstützt Pflegefachassistenz und Pflegefachkraft (Unter-, Mittel- und Oberkurs)."}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/kurs-erstellen"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              + Neuen Kurs erstellen
            </Link>
            {levelFilter && (
              <Link
                href="/kurse"
                className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
                onClick={() => setLevelFilter(null)}
              >
                Alle Kurse anzeigen
              </Link>
            )}
            <Link
              href="/lernplattform-auswahl"
              className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              Zur Lernplattform
            </Link>
          </div>
        </header>

        {/* Delete confirmation dialog */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kurs löschen
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Bitte gib das Admin-Passwort ein, um diesen Kurs zu löschen.
              </p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value)
                  setDeleteError("")
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmDelete()
                }}
                placeholder="Passwort eingeben"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 mb-3"
                autoFocus
              />
              {deleteError && (
                <p className="text-sm text-red-600 mb-3">{deleteError}</p>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelDelete}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={confirmDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        )}

        {levelFilter ? (
          // Filtered view - show courses for a specific level
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {filterLabel}
            </h2>
            {filteredCourses.length === 0 ? (
              <Card className="bg-white/60 border-dashed">
                <CardContent className="py-8 text-center text-gray-500">
                  <p className="mb-3">
                    Noch keine Kurse für {filterLabel} erstellt.
                  </p>
                  <Link
                    href="/kurs-erstellen"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Jetzt ersten Kurs erstellen →
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onDelete={
                      course.id !== "pflegefachassistenz-default"
                        ? requestDelete
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          // Full view - grouped by level
          courseLevelGroups.map((group) => {
            const groupCourses = allCourses.filter((c) =>
              (group.levels as string[]).includes(c.level)
            )
            if (groupCourses.length === 0 && group.group === "Pflegefachkraft") {
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
                          ? requestDelete
                          : undefined
                      }
                    />
                  ))}
                </div>
              </section>
            )
          })
        )}

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-3">
            Erstelle neue Kurse für Pflegefachkräfte (Unter-, Mittel-,
            Oberkurs) mit dem Kurs-Ersteller.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/kurs-erstellen"
              className="text-primary hover:underline"
            >
              Kurs erstellen
            </Link>
            <Link href="/lernplattform-auswahl" className="text-primary hover:underline">
              Zur Lernplattform
            </Link>
            <Link href="/lernplattform" className="text-primary hover:underline">
              Pflegefachassistenz
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
