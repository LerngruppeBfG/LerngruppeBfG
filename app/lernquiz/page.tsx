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

const quizSections = [
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
    ],
  },
]

export default function LernquizPage() {
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
            eine Lösung, eine kurze Begründung und die passende Quelle.
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
          {quizSections.map((section) => (
            <div key={section.title}>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {section.questions.map((quiz) => (
                  <Card key={quiz.question} className="bg-white/90">
                    <CardHeader>
                      <CardTitle className="text-lg">{quiz.question}</CardTitle>
                      <CardDescription>Wähle eine Antwort und prüfe sie.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-gray-600">
                      <ol className="space-y-1">
                        {quiz.options.map((option, index) => (
                          <li key={`${quiz.question}-${index}`} className="flex gap-2">
                            <span className="font-semibold text-gray-500">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <span>{option}</span>
                          </li>
                        ))}
                      </ol>
                      <details className="rounded-lg border border-dashed border-gray-200 bg-white/80 p-3">
                        <summary className="cursor-pointer text-sm font-medium text-gray-700">
                          Lösung anzeigen
                        </summary>
                        <p className="mt-2 font-medium text-gray-700">
                          Richtige Antwort: {quiz.answer}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {quiz.explanation}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          Quelle: {quiz.source}
                        </p>
                      </details>
                    </CardContent>
                  </Card>
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
