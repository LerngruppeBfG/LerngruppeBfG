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
import { pdfKnowledge, searchKnowledge, type KnowledgeEntry } from "./pdfKnowledge"

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

/** Find knowledge entries relevant to the course topic and PDF files. */
function findRelevantKnowledge(topicName: string, topics: string[]): KnowledgeEntry[] {
  const searchTerms = [topicName, ...topics].join(" ")
  const results = searchKnowledge(searchTerms)
  if (results.length > 0) return results.slice(0, 30)
  // Fallback: try individual topics
  const all: KnowledgeEntry[] = []
  for (const t of topics) {
    for (const entry of searchKnowledge(t)) {
      if (!all.some((e) => e.topic === entry.topic && e.subtopic === entry.subtopic)) all.push(entry)
    }
    if (all.length >= 30) break
  }
  return all.slice(0, 30)
}

/** Build a compact knowledge summary string for AI prompts. */
function buildKnowledgeContext(entries: KnowledgeEntry[]): string {
  if (entries.length === 0) return ""
  return "\n\nHier sind relevante Fachinhalte aus den Unterrichts-PDFs:\n\n" +
    entries.map((e) => `[${e.topic} – ${e.subtopic}]: ${e.content}`).join("\n\n")
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
  const knowledge = findRelevantKnowledge(topicName, topics)
  const knowledgeCtx = buildKnowledgeContext(knowledge)

  const prompt = `Erstelle Lernfelder für einen Pflegekurs zum Thema "${topicName}".

Verfügbare Themen aus den PDFs: ${topicList}
PDF-Dateien: ${pdfList}
${knowledgeCtx}

Erstelle 2-4 Lernfelder. Jedes Lernfeld soll folgende Struktur haben:
- title: Titel des Lernfeldes (spezifisch zum Thema)
- subtitle: Untertitel mit Bezug zum Kurs
- goals: Array mit 3-4 konkreten, fachlich korrekten Lernzielen die sich direkt auf den Inhalt beziehen
- documents: Array mit den zugehörigen PDF-Dateinamen

Nutze die bereitgestellten Fachinhalte um spezifische, nicht-generische Lernziele zu formulieren.
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
  const knowledge = findRelevantKnowledge(topicName, topics)
  const knowledgeCtx = buildKnowledgeContext(knowledge)

  const prompt = `Erstelle ${count} Lernkarten (Flashcards) für Pflegeschüler zum Thema "${topicName}".

Verfügbare Themen: ${topicList}
PDF-Dateien: ${pdfList}
${knowledgeCtx}

Jede Lernkarte soll fachlich korrekte, spezifische Pflegeinhalte enthalten – KEINE generischen Platzhalter:
- title: Kurzer, spezifischer Titel (z.B. "Virchow-Trias" statt "Thrombose – Karte 1")
- question: Eine konkrete, prüfungsrelevante Lernfrage
- answer: Die fachlich korrekte, ausführliche Antwort (2-4 Sätze mit konkreten Fakten, Zahlen, Definitionen)
- tip: Ein spezifischer Lerntipp der sich auf den Inhalt bezieht
- source: Die zugehörige PDF-Datei

Nutze die bereitgestellten Fachinhalte für fachlich korrekte, detaillierte Karten.
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
  const knowledge = findRelevantKnowledge(topicName, topics)
  const knowledgeCtx = buildKnowledgeContext(knowledge)

  const prompt = `Erstelle ${count} Multiple-Choice-Quizfragen für Pflegeschüler zum Thema "${topicName}".

Verfügbare Themen: ${topicList}
PDF-Dateien: ${pdfList}
${knowledgeCtx}

Jede Frage soll 4 Antwortmöglichkeiten haben, wobei genau EINE richtig ist:
- title: Kurzer, spezifischer Titel (z.B. "Virchow-Trias" statt "Thrombose – Quiz 1")
- question: Die Quizfrage (fachlich korrekt, prüfungsrelevant, konkret – keine generischen Fragen)
- options: Array mit genau 4 Antwortoptionen (vollständige, fachlich plausible Sätze)
- answer: Der Buchstabe der richtigen Antwort ("A", "B", "C" oder "D")
- explanation: Erklärung warum die Antwort richtig ist (2-3 Sätze mit Fachinhalten)

Nutze die bereitgestellten Fachinhalte für fachlich korrekte, spezifische Fragen.
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
  const knowledge = findRelevantKnowledge(topicName, topics)
  const knowledgeCtx = buildKnowledgeContext(knowledge)

  const prompt = `Erstelle ${count} Lerntabellen für Pflegeschüler zum Thema "${topicName}".

Verfügbare Themen: ${topicList}
PDF-Dateien: ${pdfList}
${knowledgeCtx}

Jede Tabelle soll fachlich korrekte, spezifische Pflegeinhalte zusammenfassen:
- title: Titel der Tabelle (z.B. "Virchow-Trias – Risikofaktoren und Prophylaxe")
- headers: Array mit 3 Spaltenüberschriften
- rows: Array mit 4-5 Zeilen, jede Zeile ist ein Objekt mit den Header-Keys

Die Inhalte müssen fachlich korrekt, spezifisch und detailliert sein – nutze die bereitgestellten Fachinhalte.
KEINE generischen Platzhalter wie "Grundlegende Definition von X".
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
  const knowledge = findRelevantKnowledge(topicName, topics)
  const knowledgeCtx = buildKnowledgeContext(knowledge)

  const prompt = `Erstelle ${qaCount} Fragen und Antworten für Pflegeschüler zum Thema "${topicName}".

Verfügbare Themen: ${topicList}
PDF-Dateien: ${pdfList}
${knowledgeCtx}

Jede Frage-Antwort soll prüfungsrelevantes Pflegewissen abdecken:
- question: Eine konkrete, spezifische Lernfrage (z.B. "Nenne die drei Faktoren der Virchow-Trias" statt "Was sind die Grundlagen?")
- answer: Eine fachlich korrekte, ausführliche Antwort (3-4 Sätze mit konkreten Fakten und Zusammenhängen)

Nutze die bereitgestellten Fachinhalte für fachlich korrekte, detaillierte Antworten.
Die Fragen sollen verschiedene Aspekte des Themas abdecken (Definition, Ursachen, Symptome, Maßnahmen, Prävention etc.).
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
  const knowledge = findRelevantKnowledge(topicName, topics)

  for (let i = 0; i < pdfFiles.length && fields.length < 4; i += chunkSize) {
    const chunk = pdfFiles.slice(i, i + chunkSize)
    const fieldTopics = extractTopics(chunk)
    const fieldTitle = fieldTopics[0] || `${topicName} – Bereich ${fields.length + 1}`

    // Find knowledge entries matching this field's topics for specific goals
    const fieldKnowledge = knowledge.filter((e) =>
      fieldTopics.some((ft) =>
        e.topic.toLowerCase().includes(ft.toLowerCase()) ||
        ft.toLowerCase().includes(e.topic.toLowerCase()) ||
        e.subtopic.toLowerCase().includes(ft.toLowerCase())
      )
    )

    const goals: string[] = []
    if (fieldKnowledge.length > 0) {
      // Generate specific goals from actual knowledge entries
      for (const entry of fieldKnowledge.slice(0, 4)) {
        const firstSentence = entry.content.split(/\.\s+/)[0]
        if (firstSentence && firstSentence.length > 15) {
          goals.push(`${entry.subtopic}: ${firstSentence}.`)
        }
      }
    }
    // Fill remaining goals with topic-specific defaults
    while (goals.length < 4) {
      const defaults = [
        `Grundlagen von ${fieldTitle} verstehen und in eigenen Worten erklären können.`,
        `Risikofaktoren und Ursachen von ${fieldTitle} benennen und Patienten zuordnen können.`,
        `Pflegerische Maßnahmen zu ${fieldTitle} planen und begründen können.`,
        `Dokumentation und Beobachtungskriterien bei ${fieldTitle} sicher anwenden.`,
      ]
      goals.push(defaults[goals.length])
    }

    fields.push({
      title: fieldTitle,
      subtitle: `Lernfeld aus ${topicName}`,
      goals: goals.slice(0, 4),
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
  const knowledge = findRelevantKnowledge(topicName, topics)

  // Generate cards from actual knowledge entries first
  for (let i = 0; i < count; i++) {
    if (i < knowledge.length) {
      const entry = knowledge[i]
      const sentences = entry.content.split(/\.\s+/).filter((s) => s.length > 15)
      const answer = sentences.length > 1
        ? sentences.slice(0, 3).join(". ") + "."
        : entry.content

      cards.push({
        title: `${entry.topic} – ${entry.subtopic}`,
        question: `Erkläre ${entry.subtopic} im Bereich ${entry.topic}.`,
        answer,
        tip: `Merke dir die Schlüsselbegriffe: ${entry.keywords.slice(0, 3).join(", ")}. Quelle: ${entry.source}.`,
        source: (entry.source.length > 0 && pdfFiles.find((f) =>
          f.toLowerCase().includes(entry.source.split(" ")[0].toLowerCase())
        )) || pdfFiles[i % pdfFiles.length],
      })
    } else {
      // Fallback for topics without knowledge entries
      const topic = topics[i % topics.length] || topicName
      const source = pdfFiles[i % pdfFiles.length]
      cards.push({
        title: `${topic} – Wiederholung ${i + 1}`,
        question: `Was sind die wichtigsten Aspekte von ${topic} für die Pflegepraxis?`,
        answer: `Zu ${topic} gehören: Definition und Abgrenzung des Begriffs, typische Ursachen und Risikofaktoren, Symptome und Beobachtungskriterien sowie pflegerische Maßnahmen und Dokumentation. Details findest du in „${source}".`,
        tip: `Lies die PDF „${source}" und erstelle dir eigene Stichpunkte zu Definition, Ursachen, Symptome und Maßnahmen.`,
        source,
      })
    }
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
  const knowledge = findRelevantKnowledge(topicName, topics)

  // Generate quiz items from actual knowledge entries
  for (let i = 0; i < count; i++) {
    if (i < knowledge.length) {
      const entry = knowledge[i]
      const sentences = entry.content.split(/\.\s+/).filter((s) => s.length > 20 && s.length < 150)

      if (sentences.length >= 1) {
        const correctSentence = sentences[0]
        // Find plausible wrong answers from other topics
        const otherEntries = pdfKnowledge.filter(
          (e) => e.topic !== entry.topic || e.subtopic !== entry.subtopic
        )
        const wrongSentences = otherEntries
          .flatMap((e) => e.content.split(/\.\s+/).filter((s) => s.length > 20 && s.length < 150))
          .slice(0, 20)

        if (wrongSentences.length >= 3) {
          const selectedWrong = wrongSentences.slice(0, 3)
          const allOptions = [correctSentence + ".", ...selectedWrong.map((s) => s.endsWith(".") ? s : s + ".")]
          // Shuffle and find correct index
          const shuffled = pickRandom(allOptions, allOptions.length)
          const correctIdx = shuffled.indexOf(correctSentence + ".")
          const answerLetter = (["A", "B", "C", "D"] as const)[correctIdx]

          quizzes.push({
            title: `${entry.topic} – ${entry.subtopic}`,
            question: `Welche Aussage zu „${entry.subtopic}" ist korrekt?`,
            options: shuffled,
            answer: answerLetter,
            explanation: `Die richtige Antwort stammt aus dem Bereich ${entry.topic} – ${entry.subtopic}. ${correctSentence}.`,
          })
          continue
        }
      }
    }

    // Fallback template for remaining items
    const topic = topics[i % topics.length] || topicName
    const source = pdfFiles[i % pdfFiles.length]
    const templateIdx = i % 4
    const templates = [
      {
        q: `Welche Aussage zu ${topic} ist korrekt?`,
        opts: [
          `${topic} hat keine Relevanz für die Pflegepraxis.`,
          `${topic} ist ein wichtiger Bestandteil der Pflegeausbildung und erfordert fundiertes Fachwissen.`,
          `${topic} wird nur im Oberkurs behandelt.`,
          `${topic} erfordert keine Dokumentation.`,
        ],
        a: "B" as const,
        e: `${topic} ist ein zentraler Ausbildungsinhalt der Pflege. Quelle: „${source}".`,
      },
      {
        q: `Was gehört zu den pflegerischen Grundlagen von ${topic}?`,
        opts: [
          `Nur theoretisches Wissen ohne Praxisbezug.`,
          `Definition, Ursachen, Risikofaktoren und gezielte pflegerische Maßnahmen.`,
          `Ausschließlich medikamentöse Therapie ohne Pflegeinterventionen.`,
          `Keine Dokumentation oder Beobachtung nötig.`,
        ],
        a: "B" as const,
        e: `Zu den Grundlagen von ${topic} gehören Definition, Ursachen, Risikofaktoren und pflegerische Interventionen. Quelle: „${source}".`,
      },
      {
        q: `Welche Maßnahme ist im Rahmen von ${topic} besonders wichtig?`,
        opts: [
          `Abwarten ohne Intervention oder Beobachtung.`,
          `Gezielte Beobachtung, Dokumentation und interprofessionelle Zusammenarbeit.`,
          `Eigenständige Medikamentengabe ohne ärztliche Anordnung.`,
          `Ausschließlich telefonische Beratung der Patienten.`,
        ],
        a: "B" as const,
        e: `Bei ${topic} sind gezielte Beobachtung, Dokumentation und Teamarbeit essenziell. Quelle: „${source}".`,
      },
      {
        q: `Worauf muss bei ${topic} in der Pflegepraxis besonders geachtet werden?`,
        opts: [
          `Es gibt keine besonderen Anforderungen oder Standards.`,
          `Auf individuelle Patientenbedürfnisse, Sicherheit und evidenzbasiertes Handeln.`,
          `Nur auf ärztliche Anweisungen ohne eigene Beobachtung.`,
          `Ausschließlich auf Kosteneffizienz und Zeitersparnis.`,
        ],
        a: "B" as const,
        e: `Bei ${topic} stehen individuelle Patientenbedürfnisse und Sicherheit im Vordergrund. Quelle: „${source}".`,
      },
    ]
    const t = templates[templateIdx]
    quizzes.push({
      title: `${topic} – Quiz ${i + 1}`,
      question: t.q,
      options: t.opts,
      answer: t.a,
      explanation: t.e,
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
  const knowledge = findRelevantKnowledge(topicName, topics)
  const usedTopics = topics.length > 0 ? topics : [topicName]

  for (let i = 0; i < count; i++) {
    const topic = usedTopics[i % usedTopics.length]
    const source = pdfFiles[i % pdfFiles.length]

    // Find knowledge entries for this topic
    const topicEntries = knowledge.filter((e) =>
      e.topic.toLowerCase().includes(topic.toLowerCase()) ||
      topic.toLowerCase().includes(e.topic.toLowerCase())
    )

    if (topicEntries.length >= 2) {
      // Build table from actual knowledge entries
      const rows = topicEntries.slice(0, 5).map((entry) => {
        const firstSentence = entry.content.split(/\.\s+/)[0]
        return {
          Thema: entry.subtopic,
          Inhalt: firstSentence.length > 120 ? firstSentence.substring(0, 117) + "…" : firstSentence + ".",
          Quelle: entry.source,
        }
      })

      tables.push({
        title: `${topic} – Überblick`,
        headers: ["Thema", "Inhalt", "Quelle"],
        rows,
      })
    } else {
      // Fallback with topic-specific structure
      tables.push({
        title: `${topic} – Übersicht`,
        headers: ["Aspekt", "Beschreibung", "Quelle"],
        rows: [
          { Aspekt: "Definition", Beschreibung: `Grundlegende Definition und Abgrenzung von ${topic} im pflegerischen Kontext.`, Quelle: source },
          { Aspekt: "Ursachen / Risikofaktoren", Beschreibung: `Typische Ursachen und Risikofaktoren die zu ${topic} führen können.`, Quelle: source },
          { Aspekt: "Symptome / Beobachtung", Beschreibung: `Klinische Zeichen und pflegerische Beobachtungskriterien bei ${topic}.`, Quelle: source },
          { Aspekt: "Pflegerische Maßnahmen", Beschreibung: `Prophylaxe, Interventionen und Dokumentation bei ${topic}.`, Quelle: source },
        ],
      })
    }
  }

  return tables
}

function generateQuickQuestionsFallback(
  topicName: string,
  topics: string[],
  pdfFiles: string[]
): GeneratedQA[] {
  const qas: GeneratedQA[] = []
  const knowledge = findRelevantKnowledge(topicName, topics)
  const sources = pickRandom(pdfFiles, Math.min(6, pdfFiles.length))

  // Generate Q&A from actual knowledge entries
  for (let i = 0; i < Math.min(6, knowledge.length); i++) {
    const entry = knowledge[i]
    const sentences = entry.content.split(/\.\s+/).filter((s) => s.length > 15)
    const answer = sentences.length > 2
      ? sentences.slice(0, 3).join(". ") + "."
      : entry.content

    qas.push({
      question: `Erkläre ${entry.subtopic} im Kontext von ${entry.topic}.`,
      answer,
    })
  }

  // Fill with topic-specific templates if not enough knowledge entries
  const usedTopics = topics.length > 0 ? topics : [topicName]
  const templates = [
    {
      q: (t: string) => `Was sind die wichtigsten pflegerischen Maßnahmen bei ${t}?`,
      a: (t: string, s: string) =>
        `Die pflegerischen Maßnahmen bei ${t} umfassen: gezielte Beobachtung und Dokumentation, Umsetzung ärztlicher Anordnungen, Prophylaxe und Prävention, sowie Patienten- und Angehörigenberatung. Weitere Details findest du in „${s}".`,
    },
    {
      q: (t: string) => `Welche Beobachtungskriterien sind bei ${t} besonders wichtig?`,
      a: (t: string, s: string) =>
        `Bei ${t} sind folgende Beobachtungskriterien wichtig: Vitalzeichen, Allgemeinzustand, Schmerzverhalten, Hautbeschaffenheit und psychische Verfassung. Auffälligkeiten müssen dokumentiert und dem Arzt gemeldet werden. Quelle: „${s}".`,
    },
    {
      q: (t: string) => `Wie dokumentierst du ${t} fachgerecht?`,
      a: (t: string, s: string) =>
        `Die Dokumentation bei ${t} erfolgt nach dem AEDL-Modell oder der SIS: Informationssammlung, Maßnahmenplanung, Durchführung und Evaluation. Alle Beobachtungen, Maßnahmen und Veränderungen werden zeitnah und nachvollziehbar dokumentiert. Siehe „${s}".`,
    },
  ]

  for (let i = qas.length; i < Math.min(6, usedTopics.length * 2 + templates.length); i++) {
    const topic = usedTopics[i % usedTopics.length]
    const source = sources[i % sources.length]
    const template = templates[i % templates.length]
    qas.push({
      question: template.q(topic),
      answer: template.a(topic, source),
    })
  }

  return qas.slice(0, 6)
}
