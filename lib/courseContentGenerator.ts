/**
 * Generates learning content for a course based on topic name and PDF file names.
 *
 * When an OpenAI API key is configured (OPENAI_API_KEY on the server),
 * ChatGPT is used to extract and generate real educational content from the PDF
 * topics. Without an API key, a template-based fallback generates placeholder content.
 *
 * Each generation step is reported through a progress callback so the UI can
 * display a live feed / progress bar.
 */

import type {
  CourseConfig,
  GeneratedCourseContent,
  GeneratedFlashcard,
  GeneratedQuiz,
  GeneratedTable,
  GeneratedQA,
  GeneratedLearningField,
} from "./courseConfig"
import { isOpenAIConfigured, chatCompletion, type ChatMessage } from "./openaiClient"

/* ── helpers ─────────────────────────────────────────────── */

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

/** Derive short topic labels from PDF file names. */
function extractTopics(pdfFiles: string[]): string[] {
  const topics = new Set<string>()
  for (const f of pdfFiles) {
    const cleaned = f
      .replace(/^\d+[\s._-]*/g, "")
      .replace(/^(AB|LS|Text)\s*[-–—]?\s*/i, "")
      .replace(/\(.*\)/, "")
      .trim()
    if (cleaned.length > 0) {
      topics.add(cleaned)
    }
  }
  return Array.from(topics)
}

/** Randomly pick *n* items from an array (or all if fewer). */
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  const result: T[] = []
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length)
    const removed = copy.splice(idx, 1)
    if (removed.length > 0) result.push(removed[0])
  }
  return result
}

/* ── progress callback type ─────────────────────────────── */

export type ProgressStep = {
  label: string
  done: boolean
}

export type ProgressCallback = (steps: ProgressStep[], currentIndex: number) => void

/* ── OpenAI helper: ask ChatGPT and parse JSON ──────────── */

async function askGPT(prompt: string, maxTokens = 2048): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "Du bist ein Experte für Pflegeausbildung und erstellst Lernmaterialien. " +
        "Antworte immer auf Deutsch. Gib ausschließlich valides JSON zurück, " +
        "ohne Markdown-Codeblöcke, ohne Erklärungen.",
    },
    { role: "user", content: prompt },
  ]
  return chatCompletion(messages, { temperature: 0.7, maxTokens })
}

function safeParseJSON<T>(text: string): T | null {
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "")
    return JSON.parse(cleaned) as T
  } catch {
    return null
  }
}

/* ── generator ──────────────────────────────────────────── */

export async function generateCourseContent(
  course: CourseConfig,
  onProgress?: ProgressCallback,
  forceUseAI?: boolean
): Promise<GeneratedCourseContent> {
  const topics = extractTopics(course.pdfFiles)
  const topicName = course.topicName
  const useAI = forceUseAI ?? isOpenAIConfigured()

  const steps: ProgressStep[] = [
    { label: "Themen aus PDFs extrahieren…", done: false },
    { label: "Lernfelder erstellen…", done: false },
    { label: useAI ? "Lernkarten mit ChatGPT generieren…" : "Lernkarten generieren…", done: false },
    { label: useAI ? "Quizfragen mit ChatGPT erstellen…" : "Quizfragen erstellen…", done: false },
    { label: useAI ? "Lerntabellen mit ChatGPT aufbauen…" : "Lerntabellen aufbauen…", done: false },
    { label: useAI ? "Fragen & Antworten mit ChatGPT formulieren…" : "Fragen & Antworten formulieren…", done: false },
    { label: "Inhalte zusammenführen…", done: false },
  ]

  function report(idx: number) {
    steps[idx].done = true
    onProgress?.(steps.map((s) => ({ ...s })), idx)
  }

  /* Step 1 – extract topics */
  await sleep(400)
  report(0)

  /* Step 2 – learning fields */
  await sleep(300)
  const learningFields = useAI
    ? await generateLearningFieldsAI(topicName, topics, course.pdfFiles)
    : generateLearningFieldsFallback(topicName, topics, course.pdfFiles)
  report(1)

  /* Step 3 – flashcards */
  const flashcardCount = course.modules.lernkarten.enabled ? course.modules.lernkarten.count : 0
  const flashcards = useAI
    ? await generateFlashcardsAI(topicName, topics, course.pdfFiles, flashcardCount)
    : generateFlashcardsFallback(topicName, topics, course.pdfFiles, flashcardCount)
  report(2)

  /* Step 4 – quiz items */
  const quizCount = course.modules.lernquiz.enabled ? course.modules.lernquiz.count : 0
  const quizItems = useAI
    ? await generateQuizItemsAI(topicName, topics, course.pdfFiles, quizCount)
    : generateQuizItemsFallback(topicName, topics, course.pdfFiles, quizCount)
  report(3)

  /* Step 5 – tables */
  const tableCount = course.modules.lerntabellen.enabled ? course.modules.lerntabellen.count : 0
  const tables = useAI
    ? await generateTablesAI(topicName, topics, course.pdfFiles, tableCount)
    : generateTablesFallback(topicName, topics, course.pdfFiles, tableCount)
  report(4)

  /* Step 6 – quick questions */
  const quickQuestions = useAI
    ? await generateQuickQuestionsAI(topicName, topics, course.pdfFiles)
    : generateQuickQuestionsFallback(topicName, topics, course.pdfFiles)
  report(5)

  /* Step 7 – done */
  await sleep(300)
  report(6)

  return {
    learningFields,
    flashcards,
    quizItems,
    tables,
    quickQuestions,
    generatedAt: new Date().toISOString(),
  }
}

/* ══════════════════════════════════════════════════════════
   AI-powered generators (using OpenAI ChatGPT)
   ══════════════════════════════════════════════════════════ */

async function generateLearningFieldsAI(
  topicName: string,
  topics: string[],
  pdfFiles: string[]
): Promise<GeneratedLearningField[]> {
  const topicList = topics.length > 0 ? topics.join(", ") : topicName
  const pdfList = pdfFiles.join(", ")

  const prompt = `Erstelle Lernfelder für einen Pflegekurs zum Thema "${topicName}".

Verfügbare Themen aus den PDFs: ${topicList}
PDF-Dateien: ${pdfList}

Erstelle 2-4 Lernfelder. Jedes Lernfeld soll folgende Struktur haben:
- title: Titel des Lernfeldes (spezifisch zum Thema)
- subtitle: Untertitel mit Bezug zum Kurs
- goals: Array mit 3-4 konkreten, fachlich korrekten Lernzielen
- documents: Array mit den zugehörigen PDF-Dateinamen

Antworte als JSON-Array. Beispiel:
[{"title":"...","subtitle":"...","goals":["...","...","..."],"documents":["..."]}]`

  try {
    const response = await askGPT(prompt)
    const parsed = safeParseJSON<GeneratedLearningField[]>(response)
    if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch { /* fallback */ }
  return generateLearningFieldsFallback(topicName, topics, pdfFiles)
}

async function generateFlashcardsAI(
  topicName: string,
  topics: string[],
  pdfFiles: string[],
  count: number
): Promise<GeneratedFlashcard[]> {
  if (count <= 0) return []

  const topicList = topics.length > 0 ? topics.join(", ") : topicName
  const pdfList = pdfFiles.join(", ")

  const prompt = `Erstelle ${count} Lernkarten (Flashcards) für Pflegeschüler zum Thema "${topicName}".

Verfügbare Themen: ${topicList}
PDF-Dateien: ${pdfList}

Jede Lernkarte soll fachlich korrekte Pflegeinhalte enthalten:
- title: Kurzer Titel (z.B. "Definition Thrombose – Karte 1")
- question: Eine konkrete Lernfrage
- answer: Die fachlich korrekte, ausführliche Antwort (2-3 Sätze)
- tip: Ein Lerntipp
- source: Die zugehörige PDF-Datei

Verteile die Karten gleichmäßig auf die verschiedenen Themen.
Antworte als JSON-Array:
[{"title":"...","question":"...","answer":"...","tip":"...","source":"..."}]`

  try {
    const response = await askGPT(prompt, 3000)
    const parsed = safeParseJSON<GeneratedFlashcard[]>(response)
    if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch { /* fallback */ }
  return generateFlashcardsFallback(topicName, topics, pdfFiles, count)
}

async function generateQuizItemsAI(
  topicName: string,
  topics: string[],
  pdfFiles: string[],
  count: number
): Promise<GeneratedQuiz[]> {
  if (count <= 0) return []

  const topicList = topics.length > 0 ? topics.join(", ") : topicName
  const pdfList = pdfFiles.join(", ")

  const prompt = `Erstelle ${count} Multiple-Choice-Quizfragen für Pflegeschüler zum Thema "${topicName}".

Verfügbare Themen: ${topicList}
PDF-Dateien: ${pdfList}

Jede Frage soll 4 Antwortmöglichkeiten haben, wobei genau EINE richtig ist:
- title: Kurzer Titel (z.B. "Thrombose – Quiz 1")
- question: Die Quizfrage (fachlich korrekt und prüfungsrelevant)
- options: Array mit genau 4 Antwortoptionen (vollständige Sätze)
- answer: Der Buchstabe der richtigen Antwort ("A", "B", "C" oder "D")
- explanation: Erklärung warum die Antwort richtig ist (1-2 Sätze)

Die richtige Antwort soll NICHT immer an der gleichen Position stehen.
Antworte als JSON-Array:
[{"title":"...","question":"...","options":["A-Option","B-Option","C-Option","D-Option"],"answer":"B","explanation":"..."}]`

  try {
    const response = await askGPT(prompt, 3000)
    const parsed = safeParseJSON<GeneratedQuiz[]>(response)
    if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch { /* fallback */ }
  return generateQuizItemsFallback(topicName, topics, pdfFiles, count)
}

async function generateTablesAI(
  topicName: string,
  topics: string[],
  pdfFiles: string[],
  count: number
): Promise<GeneratedTable[]> {
  if (count <= 0) return []

  const topicList = topics.length > 0 ? topics.join(", ") : topicName
  const pdfList = pdfFiles.join(", ")

  const prompt = `Erstelle ${count} Lerntabellen für Pflegeschüler zum Thema "${topicName}".

Verfügbare Themen: ${topicList}
PDF-Dateien: ${pdfList}

Jede Tabelle soll fachlich korrekte Pflegeinhalte zusammenfassen:
- title: Titel der Tabelle (z.B. "Thrombose – Übersicht")
- headers: Array mit 3 Spaltenüberschriften (z.B. ["Aspekt", "Beschreibung", "Quelle"])
- rows: Array mit 4-5 Zeilen, jede Zeile ist ein Objekt mit den Header-Keys

Die Inhalte müssen fachlich korrekt und spezifisch zum jeweiligen Thema sein.
Antworte als JSON-Array:
[{"title":"...","headers":["Aspekt","Beschreibung","Quelle"],"rows":[{"Aspekt":"Definition","Beschreibung":"Konkreter Inhalt...","Quelle":"PDF-Name"}]}]`

  try {
    const response = await askGPT(prompt, 3000)
    const parsed = safeParseJSON<GeneratedTable[]>(response)
    if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch { /* fallback */ }
  return generateTablesFallback(topicName, topics, pdfFiles, count)
}

async function generateQuickQuestionsAI(
  topicName: string,
  topics: string[],
  pdfFiles: string[]
): Promise<GeneratedQA[]> {
  const topicList = topics.length > 0 ? topics.join(", ") : topicName
  const pdfList = pdfFiles.join(", ")
  const qaCount = Math.min(6, Math.max(4, topics.length * 2))

  const prompt = `Erstelle ${qaCount} Fragen und Antworten für Pflegeschüler zum Thema "${topicName}".

Verfügbare Themen: ${topicList}
PDF-Dateien: ${pdfList}

Jede Frage-Antwort soll prüfungsrelevantes Pflegewissen abdecken:
- question: Eine konkrete Lernfrage
- answer: Eine fachlich korrekte Antwort (2-3 Sätze)

Die Fragen sollen verschiedene Aspekte des Themas abdecken (Definition, Ursachen, Symptome, Maßnahmen, etc.).
Antworte als JSON-Array:
[{"question":"...","answer":"..."}]`

  try {
    const response = await askGPT(prompt)
    const parsed = safeParseJSON<GeneratedQA[]>(response)
    if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch { /* fallback */ }
  return generateQuickQuestionsFallback(topicName, topics, pdfFiles)
}

/* ══════════════════════════════════════════════════════════
   Fallback generators (template-based, no API needed)
   ══════════════════════════════════════════════════════════ */

function generateLearningFieldsFallback(
  topicName: string,
  topics: string[],
  pdfFiles: string[]
): GeneratedLearningField[] {
  const chunkSize = Math.max(1, Math.ceil(pdfFiles.length / Math.min(4, Math.max(1, topics.length))))
  const fields: GeneratedLearningField[] = []

  for (let i = 0; i < pdfFiles.length && fields.length < 4; i += chunkSize) {
    const chunk = pdfFiles.slice(i, i + chunkSize)
    const fieldTopics = extractTopics(chunk)
    const fieldTitle = fieldTopics[0] || `${topicName} – Bereich ${fields.length + 1}`

    fields.push({
      title: fieldTitle,
      subtitle: `Lernfeld aus ${topicName}`,
      goals: [
        `Grundlagen von ${fieldTitle} verstehen und erklären können.`,
        `Wichtige Begriffe und Definitionen aus den PDFs kennen.`,
        `Zusammenhänge zwischen Theorie und Praxis herstellen.`,
        `Relevante Inhalte für die Prüfungsvorbereitung sicher beherrschen.`,
      ],
      documents: chunk,
    })
  }

  return fields
}

function generateFlashcardsFallback(
  topicName: string,
  topics: string[],
  pdfFiles: string[],
  count: number
): GeneratedFlashcard[] {
  if (count <= 0) return []

  const cards: GeneratedFlashcard[] = []
  const usedTopics = topics.length > 0 ? topics : [topicName]

  for (let i = 0; i < count; i++) {
    const topic = usedTopics[i % usedTopics.length]
    const source = pdfFiles[i % pdfFiles.length]

    cards.push({
      title: `${topic} – Karte ${i + 1}`,
      question: `Was sind die wichtigsten Aspekte von ${topic} laut den Unterlagen?`,
      answer: `Die zentralen Punkte zu ${topic} umfassen: Definition, Ursachen, Symptome/Merkmale, Diagnostik und pflegerische Maßnahmen. Details findest du in der PDF „${source}".`,
      tip: `Lies die PDF „${source}" und markiere Schlüsselwörter. Formuliere die Antwort anschließend in eigenen Worten.`,
      source,
    })
  }

  return cards
}

function generateQuizItemsFallback(
  topicName: string,
  topics: string[],
  pdfFiles: string[],
  count: number
): GeneratedQuiz[] {
  if (count <= 0) return []

  const quizzes: GeneratedQuiz[] = []
  const usedTopics = topics.length > 0 ? topics : [topicName]

  const questionTemplates = [
    {
      q: (t: string) => `Welche Aussage zu ${t} ist korrekt?`,
      options: (t: string) => [
        `${t} hat keine Relevanz für die Pflegepraxis.`,
        `${t} ist ein wichtiger Bestandteil der Ausbildungsinhalte.`,
        `${t} wird nur im Oberkurs behandelt.`,
        `${t} erfordert keine Dokumentation.`,
      ],
      answer: "B",
      explanation: (t: string, s: string) =>
        `${t} ist ein zentraler Ausbildungsinhalt. Weitere Informationen findest du in „${s}".`,
    },
    {
      q: (t: string) => `Was gehört zu den Grundlagen von ${t}?`,
      options: (_t: string) => [
        `Nur theoretisches Wissen ohne Praxisbezug.`,
        `Definition, Ursachen und pflegerische Maßnahmen.`,
        `Ausschließlich medikamentöse Therapie.`,
        `Keine Dokumentation nötig.`,
      ],
      answer: "B",
      explanation: (t: string, s: string) =>
        `Zu den Grundlagen von ${t} gehören Definition, Ursachen und pflegerische Interventionen. Quelle: „${s}".`,
    },
    {
      q: (t: string) => `Welche Maßnahme ist im Rahmen von ${t} besonders wichtig?`,
      options: (_t: string) => [
        `Abwarten ohne Intervention.`,
        `Gezielte Beobachtung und Dokumentation.`,
        `Eigenständige Medikamentengabe ohne Arztanordnung.`,
        `Ausschließlich telefonische Beratung.`,
      ],
      answer: "B",
      explanation: (t: string, s: string) =>
        `Bei ${t} ist gezielte Beobachtung und Dokumentation essenziell. Siehe „${s}".`,
    },
    {
      q: (t: string) => `Worauf muss bei ${t} in der Pflegepraxis geachtet werden?`,
      options: (_t: string) => [
        `Es gibt keine besonderen Anforderungen.`,
        `Auf individuelle Patientenbedürfnisse und Sicherheit.`,
        `Nur auf ärztliche Anweisungen.`,
        `Ausschließlich auf Kosteneffizienz.`,
      ],
      answer: "B",
      explanation: (t: string, s: string) =>
        `Bei ${t} stehen individuelle Patientenbedürfnisse und Sicherheit im Vordergrund. Quelle: „${s}".`,
    },
  ]

  for (let i = 0; i < count; i++) {
    const topic = usedTopics[i % usedTopics.length]
    const source = pdfFiles[i % pdfFiles.length]
    const template = questionTemplates[i % questionTemplates.length]

    quizzes.push({
      title: `${topic} – Quiz ${i + 1}`,
      question: template.q(topic),
      options: template.options(topic),
      answer: template.answer,
      explanation: template.explanation(topic, source),
    })
  }

  return quizzes
}

function generateTablesFallback(
  topicName: string,
  topics: string[],
  pdfFiles: string[],
  count: number
): GeneratedTable[] {
  if (count <= 0) return []

  const tables: GeneratedTable[] = []
  const usedTopics = topics.length > 0 ? topics : [topicName]

  for (let i = 0; i < count; i++) {
    const topic = usedTopics[i % usedTopics.length]
    const source = pdfFiles[i % pdfFiles.length]

    tables.push({
      title: `${topic} – Übersicht`,
      headers: ["Aspekt", "Beschreibung", "Quelle"],
      rows: [
        { Aspekt: "Definition", Beschreibung: `Grundlegende Definition von ${topic}`, Quelle: source },
        { Aspekt: "Ursachen", Beschreibung: `Mögliche Ursachen und Risikofaktoren`, Quelle: source },
        { Aspekt: "Symptome", Beschreibung: `Typische Anzeichen und Symptome`, Quelle: source },
        { Aspekt: "Maßnahmen", Beschreibung: `Pflegerische Interventionen und Maßnahmen`, Quelle: source },
      ],
    })
  }

  return tables
}

function generateQuickQuestionsFallback(
  topicName: string,
  topics: string[],
  pdfFiles: string[]
): GeneratedQA[] {
  const qas: GeneratedQA[] = []
  const usedTopics = topics.length > 0 ? topics : [topicName]
  const sources = pickRandom(pdfFiles, Math.min(6, pdfFiles.length))

  const templates = [
    {
      q: (t: string) => `Was sind die wichtigsten Lernziele zum Thema ${t}?`,
      a: (t: string, s: string) =>
        `Die Lernziele umfassen: Definitionen kennen, Ursachen verstehen, Symptome erkennen und pflegerische Maßnahmen ableiten können. Quelle: „${s}".`,
    },
    {
      q: (t: string) => `Welche PDFs sollte ich für ${t} zuerst lesen?`,
      a: (t: string, s: string) =>
        `Beginne mit „${s}" – dort findest du die Grundlagen. Arbeite dich dann durch die weiteren Unterlagen.`,
    },
    {
      q: (t: string) => `Wie kann ich ${t} am besten für die Prüfung lernen?`,
      a: (t: string, s: string) =>
        `Nutze die Lernkarten und Quizfragen auf dieser Seite. Lies zusätzlich „${s}" und markiere Schlüsselbegriffe.`,
    },
    {
      q: (t: string) => `Was muss ich zu ${t} in der Praxis wissen?`,
      a: (t: string, s: string) =>
        `In der Praxis ist vor allem die Umsetzung der theoretischen Inhalte wichtig: Beobachtung, Dokumentation und Kommunikation im Team. Siehe „${s}".`,
    },
  ]

  for (let i = 0; i < Math.min(templates.length, usedTopics.length * 2); i++) {
    const topic = usedTopics[i % usedTopics.length]
    const source = sources[i % sources.length]
    const template = templates[i % templates.length]
    qas.push({
      question: template.q(topic),
      answer: template.a(topic, source),
    })
  }

  return qas
}
