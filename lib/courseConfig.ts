/**
 * Course configuration types and utilities.
 *
 * Each "Kurs" describes one learning course inside the platform.
 * The course creator page writes a CourseConfig and the course
 * detail pages read it.
 */

/* ── Course levels ────────────────────────────────────────── */

export type CourseLevel =
  | "pflegefachassistenz"
  | "unterkurs"
  | "mittelkurs"
  | "oberkurs"

export const courseLevelLabels: Record<CourseLevel, string> = {
  pflegefachassistenz: "Pflegefachassistenz",
  unterkurs: "Unterkurs",
  mittelkurs: "Mittelkurs",
  oberkurs: "Oberkurs",
}

export const courseLevelDescriptions: Record<CourseLevel, string> = {
  pflegefachassistenz: "Ausbildung zur Pflegefachassistenz",
  unterkurs: "Pflegefachkraft – Unterkurs (1. Ausbildungsjahr)",
  mittelkurs: "Pflegefachkraft – Mittelkurs (2. Ausbildungsjahr)",
  oberkurs: "Pflegefachkraft – Oberkurs (3. Ausbildungsjahr)",
}

export const courseLevelGroups = [
  {
    group: "Pflegefachassistenz",
    levels: ["pflegefachassistenz"] as CourseLevel[],
  },
  {
    group: "Pflegefachkraft",
    levels: ["unterkurs", "mittelkurs", "oberkurs"] as CourseLevel[],
  },
]

/* ── Module types that can be created per course ──────────── */

export type ModuleType =
  | "lerntabellen"
  | "tabellen"
  | "lernquiz"
  | "lernkarten"
  | "lernmethoden"
  | "abbildungen"
  | "ki-assistent"
  | "ki-quiz"

export const moduleTypeLabels: Record<ModuleType, string> = {
  lerntabellen: "Lerntabellen",
  tabellen: "Tabellen & Übersichten",
  lernquiz: "Lernquiz",
  lernkarten: "Lernkarten",
  lernmethoden: "Lernmethoden",
  abbildungen: "Abbildungen",
  "ki-assistent": "KI-Assistent",
  "ki-quiz": "KI-Quiz",
}

export const moduleTypeDescriptions: Record<ModuleType, string> = {
  lerntabellen: "Kleine, kompakte Merktabellen zum schnellen Nachschlagen",
  tabellen: "Ausführliche Tabellen für Pflegeprozesse und Dokumentation",
  lernquiz: "Quizfragen mit Lösungen und Begründungen",
  lernkarten: "Karteikarten zum aktiven Wiederholen",
  lernmethoden: "Schritt-für-Schritt-Lernmethoden mit PDF-Bezug",
  abbildungen: "Grafiken und Schemata aus den PDFs",
  "ki-assistent": "KI-Chat der alle PDF-Inhalte durchsucht",
  "ki-quiz": "Dynamisch generierte Quizfragen aus dem PDF-Wissen",
}

export const allModuleTypes: ModuleType[] = [
  "lerntabellen",
  "tabellen",
  "lernquiz",
  "lernkarten",
  "lernmethoden",
  "abbildungen",
  "ki-assistent",
  "ki-quiz",
]

/* ── Module configuration (enabled + count) ───────────────── */

export type ModuleConfig = {
  enabled: boolean
  count: number
}

/* ── Full course configuration ────────────────────────────── */

/* ── Generated course content types ───────────────────────── */

export type GeneratedFlashcard = {
  title: string
  question: string
  answer: string
  tip: string
  source: string
}

export type GeneratedQuiz = {
  title: string
  question: string
  options: string[]
  answer: string
  explanation: string
}

export type GeneratedTableRow = Record<string, string>

export type GeneratedTable = {
  title: string
  headers: string[]
  rows: GeneratedTableRow[]
}

export type GeneratedQA = {
  question: string
  answer: string
}

export type GeneratedLearningField = {
  title: string
  subtitle: string
  goals: string[]
  documents: string[]
}

export type GeneratedCourseContent = {
  learningFields: GeneratedLearningField[]
  flashcards: GeneratedFlashcard[]
  quizItems: GeneratedQuiz[]
  tables: GeneratedTable[]
  quickQuestions: GeneratedQA[]
  generatedAt: string
}

export type GenerationStatus = "idle" | "generating" | "done" | "error"

export type CourseConfig = {
  id: string
  topicName: string
  level: CourseLevel
  pdfFiles: string[]
  modules: Record<ModuleType, ModuleConfig>
  createdAt: string
  generatedContent?: GeneratedCourseContent
  generationStatus?: GenerationStatus
}

/* ── Default module counts ────────────────────────────────── */

export const defaultModuleConfig: Record<ModuleType, ModuleConfig> = {
  lerntabellen: { enabled: true, count: 4 },
  tabellen: { enabled: true, count: 3 },
  lernquiz: { enabled: true, count: 8 },
  lernkarten: { enabled: true, count: 10 },
  lernmethoden: { enabled: true, count: 5 },
  abbildungen: { enabled: true, count: 6 },
  "ki-assistent": { enabled: true, count: 1 },
  "ki-quiz": { enabled: true, count: 1 },
}

/* ── Slider ranges per module type ────────────────────────── */

export const moduleSliderRange: Record<ModuleType, { min: number; max: number }> = {
  lerntabellen: { min: 1, max: 20 },
  tabellen: { min: 1, max: 15 },
  lernquiz: { min: 2, max: 30 },
  lernkarten: { min: 2, max: 40 },
  lernmethoden: { min: 1, max: 20 },
  abbildungen: { min: 1, max: 20 },
  "ki-assistent": { min: 1, max: 1 },
  "ki-quiz": { min: 1, max: 1 },
}

/* ── Suggest module counts based on PDF count ─────────────── */

/**
 * Suggest slider values based on the number of uploaded PDFs.
 *
 * The idea: more PDFs → bigger topic → more content items should be
 * generated.  The returned counts are clamped to each module's
 * allowed slider range so they can be used directly.
 */
export function suggestModuleCounts(
  pdfCount: number
): Record<ModuleType, ModuleConfig> {
  // Normalise pdfCount into a 0-1 ratio across a 1-30 PDF range.
  const ratio = Math.min(1, Math.max(0, (pdfCount - 1) / 29))

  function scaled(min: number, max: number): number {
    return Math.round(min + ratio * (max - min))
  }

  function clamp(value: number, type: ModuleType): number {
    const range = moduleSliderRange[type]
    return Math.min(range.max, Math.max(range.min, value))
  }

  return {
    lerntabellen:  { enabled: true, count: clamp(scaled(2, 15), "lerntabellen") },
    tabellen:      { enabled: true, count: clamp(scaled(1, 10), "tabellen") },
    lernquiz:      { enabled: true, count: clamp(scaled(3, 25), "lernquiz") },
    lernkarten:    { enabled: true, count: clamp(scaled(4, 30), "lernkarten") },
    lernmethoden:  { enabled: true, count: clamp(scaled(2, 15), "lernmethoden") },
    abbildungen:   { enabled: true, count: clamp(scaled(2, 15), "abbildungen") },
    "ki-assistent": { enabled: true, count: 1 },
    "ki-quiz":      { enabled: true, count: 1 },
  }
}

/* ── Storage helpers (localStorage) ───────────────────────── */

const STORAGE_KEY = "lernplattform-courses"

export function getStoredCourses(): CourseConfig[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CourseConfig[]) : []
  } catch {
    return []
  }
}

export function saveCourse(course: CourseConfig): void {
  const courses = getStoredCourses()
  const index = courses.findIndex((c) => c.id === course.id)
  if (index >= 0) {
    courses[index] = course
  } else {
    courses.push(course)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
}

export function deleteCourse(id: string): void {
  const courses = getStoredCourses().filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
}

/* ── The existing Pflegefachassistenz course (hardcoded) ───── */

export const pflegefachassistenzCourse: CourseConfig = {
  id: "pflegefachassistenz-default",
  topicName: "Pflegefachassistenz",
  level: "pflegefachassistenz",
  pdfFiles: [
    "04 Wunden & Wundversorgung",
    "04a AB Wundheilung",
    "04b Literatur Wunden und Drainagen",
    "LS 4C Herr Winterhaus (Fallbeispiel)",
    "1. Diabetes Präsentation",
    "3. AB Diabetes mellitus",
    "6. AB Diabetes mellitus Typ 2",
    "7. Lösung AB Diabetes mellitus Typ 2",
    "8 Pflege bei Diabetes mellitus Typ 2",
    "5. Insulinspritzen mit dem PEN",
    "2. Die 10 Regeln der DGE",
    "1. Definition Thrombose",
    "1a Lungenembolie",
    "1b Venensystem der Beine",
    "2. Übersicht Virchow-Trias",
    "3. Risikofaktoren einer Thrombose",
    "4. Zuordnung der Virchow-Trias",
    "6. Ansatzpunkte & Ziele der Thromboseprophylaxe",
    "01a Thromboseprophylaxe - Pflegeassistenz Heute",
    "01b AB - Thromboseprophylaxe",
    "01c AB Virchow-Trias",
    "Text - Atemübungen",
    "Text - Bewegungsübungen",
    "Text - Ausstreichen der Beinvenen",
    "Text - Hochlagerung der Beine",
    "Text - Kompressionsverband",
    "Text - Medizinischer Thromboseprophylaxestrumpf",
    "Fieber",
  ],
  modules: {
    lerntabellen: { enabled: true, count: 10 },
    tabellen: { enabled: true, count: 5 },
    lernquiz: { enabled: true, count: 20 },
    lernkarten: { enabled: true, count: 20 },
    lernmethoden: { enabled: true, count: 20 },
    abbildungen: { enabled: true, count: 9 },
    "ki-assistent": { enabled: true, count: 1 },
    "ki-quiz": { enabled: true, count: 1 },
  },
  createdAt: "2025-01-01T00:00:00.000Z",
}
