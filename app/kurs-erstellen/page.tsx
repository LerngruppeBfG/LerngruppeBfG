"use client"

import { useState, useRef } from "react"
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
  saveCourse,
  defaultModuleConfig,
  moduleSliderRange,
  courseLevelLabels,
  courseLevelDescriptions,
  moduleTypeLabels,
  moduleTypeDescriptions,
  allModuleTypes,
  type CourseConfig,
  type CourseLevel,
  type ModuleType,
  type ModuleConfig,
} from "@/lib/courseConfig"

/* ── Step indicator ───────────────────────────────────────── */

function StepIndicator({
  current,
  total,
}: {
  current: number
  total: number
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              i < current
                ? "bg-primary text-primary-foreground"
                : i === current
                ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`w-8 h-0.5 ${
                i < current ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Step 1: Topic & Level ────────────────────────────────── */

function StepTopicLevel({
  topicName,
  level,
  onTopicChange,
  onLevelChange,
}: {
  topicName: string
  level: CourseLevel | null
  onTopicChange: (v: string) => void
  onLevelChange: (v: CourseLevel) => void
}) {
  const levels: CourseLevel[] = [
    "pflegefachassistenz",
    "unterkurs",
    "mittelkurs",
    "oberkurs",
  ]

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-lg">Schritt 1: Thema & Kursstufe</CardTitle>
        <CardDescription>
          Gib den Themennamen ein und wähle die Kursstufe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Themenname
          </label>
          <input
            type="text"
            value={topicName}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="z.B. Anatomie, Pharmakologie, Hygiene…"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Kursstufe
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => onLevelChange(l)}
                className={`rounded-lg border p-4 text-left transition-all ${
                  level === l
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <p className="text-sm font-medium text-gray-900">
                  {courseLevelLabels[l]}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {courseLevelDescriptions[l]}
                </p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ── Step 2: PDF Upload ───────────────────────────────────── */

function StepPdfUpload({
  pdfFiles,
  onAdd,
  onRemove,
  fileInputRef,
}: {
  pdfFiles: string[]
  onAdd: (name: string) => void
  onRemove: (name: string) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type === "application/pdf") {
        const name = file.name.replace(/\.pdf$/i, "")
        if (!pdfFiles.includes(name)) {
          onAdd(name)
        }
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-lg">Schritt 2: PDF-Dateien hochladen</CardTitle>
        <CardDescription>
          Lade die PDF-Dateien hoch, die für diesen Kurs benötigt werden. Die
          PDFs werden im Ordner <code>/pdf-uploads</code> abgelegt.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-3xl mb-2">📄</div>
          <p className="text-sm font-medium text-gray-700">
            Klicke hier oder ziehe PDF-Dateien hierher
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Nur PDF-Dateien (.pdf) werden akzeptiert
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {pdfFiles.length > 0 ? (
          <ul className="space-y-1">
            {pdfFiles.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <span className="flex items-center gap-2">
                  <span className="text-primary">📄</span> {name}
                </span>
                <button
                  onClick={() => onRemove(name)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Noch keine PDFs hochgeladen.
          </p>
        )}

        <p className="text-xs text-gray-400">
          {pdfFiles.length} PDF-Datei{pdfFiles.length !== 1 ? "en" : ""}{" "}
          hochgeladen
        </p>
      </CardContent>
    </Card>
  )
}

/* ── Step 3: Module Configuration ─────────────────────────── */

function StepModules({
  modules,
  onChange,
}: {
  modules: Record<ModuleType, ModuleConfig>
  onChange: (type: ModuleType, cfg: ModuleConfig) => void
}) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-lg">
          Schritt 3: Module konfigurieren
        </CardTitle>
        <CardDescription>
          Aktiviere die gewünschten Lernmodule per Checkbox und stelle über den
          Slider ein, wie viele Einträge pro Modul erstellt werden sollen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {allModuleTypes.map((type) => {
          const cfg = modules[type]
          const range = moduleSliderRange[type]
          const isSingle = range.max === 1

          return (
            <div
              key={type}
              className={`rounded-lg border p-4 transition-colors ${
                cfg.enabled
                  ? "border-primary/30 bg-primary/5"
                  : "border-gray-200 bg-gray-50/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`module-${type}`}
                  checked={cfg.enabled}
                  onChange={(e) =>
                    onChange(type, { ...cfg, enabled: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`module-${type}`}
                    className="block text-sm font-medium text-gray-800 cursor-pointer"
                  >
                    {moduleTypeLabels[type]}
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {moduleTypeDescriptions[type]}
                  </p>

                  {cfg.enabled && !isSingle && (
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="range"
                        min={range.min}
                        max={range.max}
                        value={cfg.count}
                        onChange={(e) =>
                          onChange(type, {
                            ...cfg,
                            count: Number(e.target.value),
                          })
                        }
                        className="flex-1 h-2 accent-primary cursor-pointer"
                      />
                      <span className="min-w-[3rem] text-center rounded-md bg-white border border-gray-200 px-2 py-1 text-sm font-medium text-gray-700">
                        {cfg.count}
                      </span>
                    </div>
                  )}

                  {cfg.enabled && isSingle && (
                    <p className="mt-2 text-xs text-gray-400">
                      Dieses Modul ist einmalig pro Kurs.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

/* ── Step 4: Summary ──────────────────────────────────────── */

function StepSummary({
  topicName,
  level,
  pdfFiles,
  modules,
}: {
  topicName: string
  level: CourseLevel
  pdfFiles: string[]
  modules: Record<ModuleType, ModuleConfig>
}) {
  const enabledModules = Object.entries(modules).filter(
    ([, cfg]) => cfg.enabled
  )
  const totalItems = enabledModules.reduce((sum, [, cfg]) => sum + cfg.count, 0)

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-lg">Schritt 4: Zusammenfassung</CardTitle>
        <CardDescription>
          Überprüfe deine Konfiguration, bevor du den Kurs erstellst.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500">Thema</p>
            <p className="text-sm font-semibold text-gray-900">{topicName}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500">Kursstufe</p>
            <p className="text-sm font-semibold text-gray-900">
              {courseLevelLabels[level]}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500">PDF-Dateien</p>
            <p className="text-sm font-semibold text-gray-900">
              {pdfFiles.length} Dateien
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500">
              Lernelemente gesamt
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {totalItems} Elemente
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">
            Aktivierte Module:
          </p>
          <div className="space-y-1">
            {enabledModules.map(([key, cfg]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
              >
                <span className="text-gray-700">
                  {moduleTypeLabels[key as ModuleType]}
                </span>
                <Badge variant="secondary">{cfg.count} Stück</Badge>
              </div>
            ))}
          </div>
        </div>

        {pdfFiles.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">
              PDF-Dateien:
            </p>
            <div className="flex flex-wrap gap-1">
              {pdfFiles.map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  📄 {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ── Main page ────────────────────────────────────────────── */

export default function KursErstellenPage() {
  const [step, setStep] = useState(0)
  const [topicName, setTopicName] = useState("")
  const [level, setLevel] = useState<CourseLevel | null>(null)
  const [pdfFiles, setPdfFiles] = useState<string[]>([])
  const [modules, setModules] = useState<Record<ModuleType, ModuleConfig>>(
    () => ({ ...defaultModuleConfig })
  )
  const [created, setCreated] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const totalSteps = 4

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return topicName.trim().length > 0 && level !== null
      case 1:
        return pdfFiles.length > 0
      case 2:
        return Object.values(modules).some((m) => m.enabled)
      case 3:
        return true
      default:
        return false
    }
  }

  function handleCreate() {
    if (!level) return

    const course: CourseConfig = {
      id: `${level}-${Date.now()}`,
      topicName: topicName.trim(),
      level,
      pdfFiles,
      modules,
      createdAt: new Date().toISOString(),
    }

    saveCourse(course)
    setCreated(true)
  }

  function handleModuleChange(type: ModuleType, cfg: ModuleConfig) {
    setModules((prev) => ({ ...prev, [type]: cfg }))
  }

  if (created) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
        <div className="container mx-auto px-4 py-10 max-w-2xl">
          <div className="text-center space-y-6">
            <div className="text-6xl">✅</div>
            <h1 className="text-3xl font-bold text-gray-900">
              Kurs erstellt!
            </h1>
            <p className="text-gray-600">
              Der Kurs <strong>&bdquo;{topicName}&rdquo;</strong> wurde
              erfolgreich als{" "}
              <strong>{courseLevelLabels[level!]}</strong> gespeichert.
            </p>
            <p className="text-sm text-gray-500">
              {pdfFiles.length} PDF-Dateien ·{" "}
              {Object.values(modules).filter((m) => m.enabled).length} Module
              aktiviert
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Link
                href="/kurse"
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                Zur Kursübersicht
              </Link>
              <button
                onClick={() => {
                  setCreated(false)
                  setStep(0)
                  setTopicName("")
                  setLevel(null)
                  setPdfFiles([])
                  setModules({ ...defaultModuleConfig })
                }}
                className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
              >
                Weiteren Kurs erstellen
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <header className="text-center mb-8">
          <Badge className="mb-3">Kurs erstellen</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            Neuen Kurs erstellen
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Erstelle in wenigen Schritten einen neuen Lernkurs. Gib das Thema
            an, lade PDFs hoch und konfiguriere, welche Module mit wie vielen
            Einträgen generiert werden sollen.
          </p>
          <div className="mt-4">
            <Link
              href="/kurse"
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              ← Zurück zur Kursübersicht
            </Link>
          </div>
        </header>

        <StepIndicator current={step} total={totalSteps} />

        <div className="mb-6">
          {step === 0 && (
            <StepTopicLevel
              topicName={topicName}
              level={level}
              onTopicChange={setTopicName}
              onLevelChange={setLevel}
            />
          )}
          {step === 1 && (
            <StepPdfUpload
              pdfFiles={pdfFiles}
              onAdd={(name) => setPdfFiles((prev) => [...prev, name])}
              onRemove={(name) =>
                setPdfFiles((prev) => prev.filter((n) => n !== name))
              }
              fileInputRef={fileInputRef}
            />
          )}
          {step === 2 && (
            <StepModules modules={modules} onChange={handleModuleChange} />
          )}
          {step === 3 && level && (
            <StepSummary
              topicName={topicName}
              level={level}
              pdfFiles={pdfFiles}
              modules={modules}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Zurück
          </button>

          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Weiter
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={!canProceed()}
              className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Kurs erstellen ✓
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
