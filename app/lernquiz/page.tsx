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

const quizGuidelines = [
  {
    title: "Selbstcheck",
    description:
      "Wähle zuerst eine Antwort und begründe sie, bevor du die Lösung öffnest.",
  },
  {
    title: "Fehler notieren",
    description:
      "Schreibe dir falsche Antworten kurz auf und wiederhole sie später.",
  },
  {
    title: "PDF-Quelle nutzen",
    description:
      "Jede Frage ist mit den PDF-Unterlagen verknüpft, damit du schnell nachlesen kannst.",
  },
  {
    title: "Lerntempo",
    description:
      "Plane pro Quizrunde 10–15 Minuten, damit du nicht unter Zeitdruck gerätst.",
  },
]

type QuizQuestion = {
  question: string
  options: string[]
  answer: string
  explanation: string
  source: string
}

type QuizSection = {
  title: string
  description: string
  questions: QuizQuestion[]
}

const allQuizSections: QuizSection[] = [
  {
    title: "Wundversorgung",
    description: "Grundlagen und aseptische Arbeitsweise überprüfen.",
    questions: [
      {
        question: "Welche Aussage beschreibt eine aseptische Wunde korrekt?",
        options: [
          "Sie ist mit Keimen besiedelt und eitrig.",
          "Sie ist keimfrei, z.B. eine OP-Wunde.",
          "Sie entsteht ausschließlich durch thermische Einwirkung.",
          "Sie ist immer chronisch und schlecht heilend.",
        ],
        answer: "B",
        explanation: "Aseptische Wunden gelten als keimfrei.",
        source: "04 Wunden & Wundversorgung",
      },
      {
        question: "Welche Phase gehört zur Wundheilung?",
        options: [
          "Exsudation",
          "Mineralisation",
          "Oxidation",
          "Konsolidierung",
        ],
        answer: "A",
        explanation: "Die Exsudationsphase ist die erste Phase der Wundheilung.",
        source: "04a AB Wundheilung",
      },
      {
        question: "Welche Angabe gehört zur Wunddokumentation?",
        options: [
          "Wundgröße und Exsudatmenge",
          "Lieblingsessen der Patientin",
          "Raumtemperatur im Zimmer",
          "Dienstplan der Woche",
        ],
        answer: "A",
        explanation:
          "Wundgröße, Exsudat, Geruch und Schmerzen sind Pflichtangaben.",
        source: "04 Wunden & Wundversorgung",
      },
      {
        question: "Was passt zur Non-Touch-Technik?",
        options: [
          "Sterile Wundauflage mit den Fingern anfassen",
          "Sterile Pinzette verwenden und Fläche nicht berühren",
          "Wunde mit ungewaschenen Händen abtasten",
          "Verband ohne Desinfektion wechseln",
        ],
        answer: "B",
        explanation:
          "Bei der Non-Touch-Technik werden sterile Instrumente genutzt.",
        source: "04b Literatur Wunden und Drainagen",
      },
      {
        question: "Welche Wundart entsteht durch Hitze oder Kälte?",
        options: [
          "Mechanische Wunde",
          "Chemische Wunde",
          "Thermische Wunde",
          "Strahlenbedingte Wunde",
        ],
        answer: "C",
        explanation:
          "Thermische Wunden entstehen durch Hitze (Verbrennung) oder Kälte (Erfrierung).",
        source: "04 Wunden & Wundversorgung",
      },
      {
        question: "Welches Material wird bei einem aseptischen Verbandswechsel benötigt?",
        options: [
          "Sterile Kompressen, Desinfektionsmittel und Handschuhe",
          "Nur ein Pflaster",
          "Haushaltspapier und Klebeband",
          "Schere ohne sterile Verpackung",
        ],
        answer: "A",
        explanation:
          "Für einen aseptischen Verbandswechsel werden sterile Materialien und Desinfektionsmittel benötigt.",
        source: "04 Wunden & Wundversorgung",
      },
      {
        question: "Was kennzeichnet die Proliferationsphase der Wundheilung?",
        options: [
          "Blutung und Entzündung",
          "Bildung von Granulationsgewebe",
          "Vollständige Narbenbildung",
          "Abstoßung von Gewebe",
        ],
        answer: "B",
        explanation:
          "In der Proliferationsphase bildet sich neues Granulationsgewebe zur Wundfüllung.",
        source: "04a AB Wundheilung",
      },
      {
        question: "Was unterscheidet primäre von sekundärer Wundheilung?",
        options: [
          "Primäre Wundheilung dauert immer länger.",
          "Sekundäre Wundheilung erfolgt bei verunreinigten Wunden mit größerer Narbe.",
          "Primäre Wundheilung tritt nur bei chronischen Wunden auf.",
          "Es gibt keinen Unterschied.",
        ],
        answer: "B",
        explanation:
          "Primär heilt komplikationslos mit kleiner Narbe, sekundär bei Infektion/Verunreinigung langsamer.",
        source: "04 Wunden & Wundversorgung",
      },
    ],
  },
  {
    title: "Diabetes & Ernährung",
    description: "Werte, Notfälle und Ernährungsempfehlungen trainieren.",
    questions: [
      {
        question: "Welche HbA1c-Grenze gilt als Diagnosegrenze?",
        options: ["≥ 5,5%", "≥ 6,5%", "≥ 7,5%", "≥ 8,5%"],
        answer: "B",
        explanation: "Die Präsentation nennt ≥ 6,5% als Diagnosegrenze.",
        source: "1. Diabetes Präsentation",
      },
      {
        question: "Was ist bei Hypoglykämie zuerst zu tun?",
        options: [
          "Insulin spritzen",
          "Glukose geben und BZ kontrollieren",
          "Flüssigkeit einschränken",
          "Patient sofort mobilisieren",
        ],
        answer: "B",
        explanation:
          "Bei < 50 mg/dl sofort Glukose geben und den Arzt informieren.",
        source: "1. Diabetes Präsentation",
      },
      {
        question: "Welche Empfehlung gehört zu den DGE-Regeln?",
        options: [
          "5 Portionen Obst und Gemüse pro Tag",
          "Kein Wasser trinken",
          "Nur Fleisch essen",
          "Zuckerfreie Getränke vermeiden",
        ],
        answer: "A",
        explanation: "Die DGE empfiehlt 5 Portionen Obst und Gemüse täglich.",
        source: "2.Die 10-Regeln-der-DGE",
      },
      {
        question: "Was beschreibt der oGTT?",
        options: [
          "Zuckertest nach Glukosegabe",
          "Röntgenaufnahme der Beine",
          "Messung der Körpertemperatur",
          "Test zur Lungenfunktion",
        ],
        answer: "A",
        explanation:
          "Beim oralen Glukosetoleranztest wird der BZ nach Glukosegabe gemessen.",
        source: "1. Diabetes Präsentation",
      },
      {
        question: "Welcher Nüchtern-Blutzuckerwert gilt als normal?",
        options: [
          "40–60 mg/dl",
          "80–100 mg/dl",
          "120–150 mg/dl",
          "200–250 mg/dl",
        ],
        answer: "B",
        explanation:
          "Der normale Nüchtern-Blutzucker liegt bei 80–100 mg/dl.",
        source: "1. Diabetes Präsentation",
      },
      {
        question: "Welche Anzeichen sprechen für eine Hyperglykämie?",
        options: [
          "Zittern und Schwitzen",
          "Starker Durst, häufiges Wasserlassen und Müdigkeit",
          "Kälteempfinden und Schüttelfrost",
          "Wadenschmerzen und Schwellung",
        ],
        answer: "B",
        explanation:
          "Starker Durst, Polyurie und Müdigkeit sind typische Zeichen einer Hyperglykämie.",
        source: "1. Diabetes Präsentation",
      },
      {
        question: "Wie viel Fleisch pro Woche empfiehlt die DGE maximal?",
        options: [
          "100–200 g",
          "300–600 g",
          "800–1000 g",
          "Keine Empfehlung",
        ],
        answer: "B",
        explanation:
          "Die DGE empfiehlt maximal 300–600 g Fleisch pro Woche.",
        source: "2.Die 10-Regeln-der-DGE",
      },
      {
        question: "Was ist beim Injizieren mit dem Insulin-PEN zu beachten?",
        options: [
          "Nadel sofort nach dem Spritzen entfernen",
          "10 Sekunden warten, bevor die Nadel entfernt wird",
          "Ohne Desinfektion spritzen",
          "Immer dieselbe Einstichstelle verwenden",
        ],
        answer: "B",
        explanation:
          "Nach der Injektion sollte man 10 Sekunden warten, damit das Insulin vollständig abgegeben wird.",
        source: "5. Insulinspritzen mit dem PEN",
      },
    ],
  },
  {
    title: "Thromboseprophylaxe",
    description: "Warnzeichen erkennen und Maßnahmen planen.",
    questions: [
      {
        question: "Welche Maßnahme gehört zur Thromboseprophylaxe?",
        options: [
          "Absolute Bettruhe ohne Mobilisation",
          "Atemübungen und aktive Fußbewegungen",
          "Beine dauerhaft tief lagern",
          "Flüssigkeitszufuhr reduzieren",
        ],
        answer: "B",
        explanation:
          "Atem- und Bewegungsübungen aktivieren die Muskelpumpe und fördern den Rückfluss.",
        source: "Text - Bewegungsübungen",
      },
      {
        question: "Welche drei Faktoren umfasst die Virchow-Trias?",
        options: [
          "Blutdruck, Temperatur, Puls",
          "Blutströmung, Gefäßwand, Gerinnung",
          "Schmerz, Schwellung, Rötung",
          "Ruhe, Bewegung, Kompression",
        ],
        answer: "B",
        explanation: "Virchow-Trias = Blutströmung, Gefäßwand, Gerinnung.",
        source: "2. Übersicht Virchow Trias",
      },
      {
        question: "Welches Symptom passt zur Beinvenenthrombose?",
        options: [
          "Beidseitige kalte Füße",
          "Einseitige Schwellung und Wadenschmerz",
          "Trockener Husten ohne Fieber",
          "Niedriger Blutzucker",
        ],
        answer: "B",
        explanation:
          "Schwellung, Wärmegefühl und Wadenschmerz sind typische Symptome.",
        source: "1. Definition Thrombose",
      },
      {
        question: "Was ist bei Verdacht auf Thrombose zu tun?",
        options: [
          "Patient sofort laufen lassen",
          "Arzt informieren und Bettruhe einhalten",
          "Beine tief lagern",
          "Kompression ohne Anordnung starten",
        ],
        answer: "B",
        explanation:
          "Bei Verdacht gilt: Arzt informieren und Bettruhe einhalten.",
        source: "1. Definition Thrombose",
      },
      {
        question: "Was ist das Ziel eines Kompressionsverbandes?",
        options: [
          "Wunde vor Licht schützen",
          "Venösen Rückfluss verbessern und Ödeme verhindern",
          "Blutfluss in den Arterien stoppen",
          "Knochen stabilisieren",
        ],
        answer: "B",
        explanation:
          "Kompressionsverbände verbessern den venösen Rückfluss und verhindern Ödeme.",
        source: "Text - Kompressionsverband",
      },
      {
        question: "Welcher Risikofaktor begünstigt eine Thrombose?",
        options: [
          "Regelmäßige Bewegung",
          "Immobilität und Dehydratation",
          "Ausreichend Flüssigkeitszufuhr",
          "Tägliches Spazierengehen",
        ],
        answer: "B",
        explanation:
          "Immobilität und Dehydratation zählen zu den wichtigsten Risikofaktoren für eine Thrombose.",
        source: "3. Risikofaktoren einer Thrombose",
      },
      {
        question: "Was ist eine mögliche Komplikation einer Thrombose?",
        options: [
          "Hypoglykämie",
          "Lungenembolie",
          "Wundinfektion",
          "Fieberkrampf",
        ],
        answer: "B",
        explanation:
          "Eine Lungenembolie ist die gefährlichste Komplikation einer tiefen Beinvenenthrombose.",
        source: "1a Lungenembolie",
      },
      {
        question: "In welche Richtung wird ein Kompressionsverband gewickelt?",
        options: [
          "Von proximal nach distal",
          "Von distal nach proximal",
          "Von der Mitte nach außen",
          "In beliebiger Richtung",
        ],
        answer: "B",
        explanation:
          "Der Druck wird von distal nach proximal aufgebaut, um den venösen Rückfluss zu fördern.",
        source: "Text - Kompressionsverband",
      },
    ],
  },
  {
    title: "Fiebermanagement",
    description: "Temperaturgrenzen und Maßnahmen sicher kennen.",
    questions: [
      {
        question: "Ab welcher Temperatur spricht man von Fieber?",
        options: ["37,0 °C", "37,5 °C", "38,0 °C", "39,5 °C"],
        answer: "C",
        explanation: "Fieber beginnt ab 38 °C Körpertemperatur.",
        source: "Fieber",
      },
      {
        question: "Welche Maßnahme hilft bei Fieber in der Höhephase?",
        options: [
          "Wadenwickel",
          "Kühle Getränke anbieten",
          "Ruhe sichern und Vitalzeichen kontrollieren",
          "Körper stark zudecken",
        ],
        answer: "C",
        explanation:
          "In der Höhephase sind Ruhe und engmaschige Vitalzeichenkontrolle wichtig.",
        source: "Fieber",
      },
      {
        question: "In welcher Phase tritt meist Schüttelfrost auf?",
        options: ["Fieberanstieg", "Fieberhöhe", "Fieberabfall", "Erschöpfung"],
        answer: "A",
        explanation: "Schüttelfrost tritt typisch im Fieberanstieg auf.",
        source: "Fieber",
      },
      {
        question: "Welche Maßnahme passt zum Fieberabfall?",
        options: [
          "Schwitzen abtrocknen und Flüssigkeit anbieten",
          "Patient kalt duschen",
          "Keine Vitalzeichenkontrolle",
          "Vollständig zudecken",
        ],
        answer: "A",
        explanation:
          "Beim Fieberabfall ist Flüssigkeitsausgleich und Beobachtung wichtig.",
        source: "Fieber",
      },
      {
        question: "Wann sollten Wadenwickel bei Fieber eingesetzt werden?",
        options: [
          "Nur bei kalten Beinen",
          "Bei warmen Beinen und Temperaturen über 39 °C",
          "Immer direkt bei Fieberanstieg",
          "Nie, da sie schädlich sind",
        ],
        answer: "B",
        explanation:
          "Wadenwickel sollten nur bei warmen Extremitäten angewendet werden.",
        source: "Fieber",
      },
      {
        question: "Wie oft sollten Vitalzeichen bei Fieber kontrolliert werden?",
        options: [
          "Einmal pro Woche",
          "Mindestens 2× täglich und bei Veränderungen",
          "Nur einmal bei Aufnahme",
          "Alle 5 Minuten",
        ],
        answer: "B",
        explanation:
          "Mindestens 2× täglich und zusätzlich bei Zustandsveränderungen.",
        source: "Fieber",
      },
      {
        question: "Welche Medikamente können bei Fieber verordnet werden?",
        options: [
          "Antibiotika als Erstmaßnahme",
          "Paracetamol oder Ibuprofen nach ärztlicher Anordnung",
          "Insulin",
          "Heparin",
        ],
        answer: "B",
        explanation:
          "Paracetamol und Ibuprofen sind gängige fiebersenkende Medikamente nach ärztlicher Anordnung.",
        source: "Fieber",
      },
    ],
  },
]

/** Fisher-Yates shuffle */
function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const QUESTIONS_PER_SECTION = 4

function QuizCard({ quiz }: { quiz: QuizQuestion }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const correctIndex = quiz.answer.charCodeAt(0) - 65

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-lg">{quiz.question}</CardTitle>
        <CardDescription>Wähle eine Antwort und prüfe sie.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-600">
        <ol className="space-y-1">
          {quiz.options.map((option, index) => {
            let optionClass =
              "flex gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors"
            if (revealed) {
              if (index === correctIndex) {
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
                key={`${quiz.question}-${index}`}
                className={optionClass}
                onClick={() => {
                  if (!revealed) setSelected(index)
                }}
              >
                <span className="font-semibold text-gray-500">
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
              Richtige Antwort: {quiz.answer}
            </p>
            {selected !== null && (
              <p
                className={`mt-1 text-xs font-medium ${
                  selected === correctIndex
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {selected === correctIndex
                  ? "✓ Richtig!"
                  : "✗ Leider falsch."}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">{quiz.explanation}</p>
            <p className="mt-2 text-xs text-gray-400">
              Quelle: {quiz.source}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function LernquizPage() {
  const [randomizedSections, setRandomizedSections] = useState(() =>
    allQuizSections.map((section) => ({
      ...section,
      questions: section.questions.slice(0, QUESTIONS_PER_SECTION),
    }))
  )

  useEffect(() => {
    setRandomizedSections(
      allQuizSections.map((section) => ({
        ...section,
        questions: shuffle(section.questions).slice(0, QUESTIONS_PER_SECTION),
      }))
    )
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="text-center mb-10">
          <Badge className="mb-3">Lernquiz</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            Lernquiz mit ausführlichen Lösungen
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Teste dein Wissen mit neuen Quizfragen aus den PDFs. Jede Frage enthält
            eine Lösung, eine kurze Begründung und die passende Quelle. Die Fragen
            werden bei jedem Laden der Seite neu gemischt.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/lernplattform"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Zur Lernplattform
            </Link>
            <Link
              href="/"
              className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              Zur Anmeldung
            </Link>
          </div>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Quiz-Regeln für maximale Lernwirkung
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {quizGuidelines.map((guide) => (
              <Card key={guide.title} className="bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          {randomizedSections.map((section) => (
            <div key={section.title}>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {section.questions.map((quiz) => (
                  <QuizCard key={quiz.question} quiz={quiz} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-3">
            Du kannst die Quizfragen erweitern, indem du neue PDFs im Ordner
            <span className="font-semibold"> /pdf-uploads</span> ablegst.
          </p>
          <Link href="/lernplattform" className="text-primary hover:underline">
            Zur Lernplattform
          </Link>
        </footer>
      </div>
    </main>
  )
}
