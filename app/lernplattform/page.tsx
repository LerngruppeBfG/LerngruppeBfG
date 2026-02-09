import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const learningFields = [
  {
    title: "Wunden",
    subtitle: "Wundheilung, Assessment & Verbandwechsel",
    goals: [
      "Wundarten unterscheiden und richtig benennen",
      "Heilungsphasen erklären und dokumentieren",
      "Verbandwechsel strukturiert planen",
    ],
    documents: ["PDF-Skript (Upload geplant)", "Checkliste Verbandwechsel", "Bildatlas"],
  },
  {
    title: "Diabetis mellitus",
    subtitle: "Stoffwechsel verstehen & Pflegeinterventionen",
    goals: [
      "Typen und Leitsymptome sicher zuordnen",
      "Blutzucker-Messungen interpretieren",
      "Ernährungs- und Bewegungsberatung vorbereiten",
    ],
    documents: ["Therapie-Übersicht (PDF)", "Insulin-Guide", "Fallbeispiele"],
  },
  {
    title: "Thromboseprophylaxe",
    subtitle: "Risiken erkennen & Maßnahmen planen",
    goals: [
      "Risikofaktoren einschätzen",
      "Medikamentöse & physikalische Maßnahmen vergleichen",
      "Patientenaufklärung üben",
    ],
    documents: ["Prophylaxe-Checkliste", "Kompressionsschema", "Übungsblatt"],
  },
  {
    title: "Fiebererkrakungen",
    subtitle: "Fiebermanagement & Beobachtung",
    goals: [
      "Fieberverlauf richtig beurteilen",
      "Pflegemaßnahmen priorisieren",
      "Warnzeichen früh erkennen",
    ],
    documents: ["Fieberkurven-Vorlage", "Symptom-Quickguide", "Pflegeplan"],
  },
]

const learningMethods = [
  {
    title: "Karteikarten-Boost",
    description: "Kurze Frage-Antwort-Runden direkt nach jedem Dokument.",
  },
  {
    title: "Fallbeispiele",
    description: "Echte Pflege-Situationen lösen und im Team besprechen.",
  },
  {
    title: "Mini-Quiz",
    description: "Jede Woche 5 Fragen – kurze Wiederholung statt Lernstress.",
  },
]

const quickChecks = [
  {
    topic: "Wunden",
    question: "Welche Phasen der Wundheilung gibt es?",
    answer: "Exsudation, Granulation, Epithelisierung, Remodellierung.",
  },
  {
    topic: "Diabetis mellitus",
    question: "Was gehört zu den klassischen Symptomen?",
    answer: "Polyurie, Polydipsie, Gewichtsverlust, Müdigkeit.",
  },
  {
    topic: "Thromboseprophylaxe",
    question: "Nenne zwei physikalische Maßnahmen.",
    answer: "Frühmobilisation, Kompressionsstrümpfe oder Venengymnastik.",
  },
  {
    topic: "Fiebererkrakungen",
    question: "Wann ist ärztliche Rücksprache dringend nötig?",
    answer: "Bei Bewusstseinsveränderung, Schüttelfrost oder starkem Anstieg.",
  },
]

export default function LernplattformPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="text-center mb-10">
          <Badge className="mb-3">Lernplattform</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            Klausur-Training ohne Langeweile
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Hier bündeln wir die Lerninhalte für die Klausur. Die Dokumente
            werden später hochgeladen – bis dahin kannst du mit Lernzielen,
            Methoden und Mini-Checks starten.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Zurück zur Anmeldung
            </Link>
            <Link
              href="/delete"
              className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              Abmeldung verwalten
            </Link>
          </div>
        </header>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Lernfelder für die Klausur
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {learningFields.map((field) => (
              <Card key={field.title} className="bg-white/80">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-xl">{field.title}</CardTitle>
                    <Badge variant="secondary">Klausurfokus</Badge>
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
                      Dokumente (Upload geplant)
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.documents.map((doc) => (
                        <Badge
                          key={doc}
                          variant="outline"
                          className="border-dashed text-xs"
                        >
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-dashed border-gray-200 bg-white/70 p-3 text-xs text-gray-500">
                    Platz für PDF & Materialien – sobald die Dateien da sind,
                    werden sie hier ergänzt.
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Lernmethoden gegen Langeweile
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {learningMethods.map((method) => (
              <Card key={method.title} className="bg-white/80">
                <CardHeader>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Mini-Checks für zwischendurch
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {quickChecks.map((check) => (
              <details
                key={check.topic}
                className="rounded-lg border border-gray-200 bg-white/80 p-4"
              >
                <summary className="cursor-pointer text-sm font-semibold text-gray-800">
                  {check.topic}: {check.question}
                </summary>
                <p className="mt-2 text-sm text-gray-600">{check.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-3">
            Du kannst jederzeit neue Dokumente hinzufügen – die Struktur steht
            schon bereit.
          </p>
          <Link href="/" className="text-primary hover:underline">
            Zur Startseite
          </Link>
        </footer>
      </div>
    </main>
  )
}
