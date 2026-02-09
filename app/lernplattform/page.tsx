import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const uploadGoals = [
  "Lernkarten werden aus den PDFs im GitHub-Ordner generiert",
  "Quizfragen basieren ausschließlich auf deinen Unterlagen",
  "Zusammenfassungen bleiben klausurrelevant",
]

const emptyDocumentsMessage = ["Noch keine PDFs im GitHub-Ordner"]

const learningFields = [
  {
    title: "Wunden",
    subtitle: "Wundheilung, Assessment & Verbandwechsel",
    goals: uploadGoals,
    documents: emptyDocumentsMessage,
  },
  {
    title: "Diabetes mellitus",
    subtitle: "Stoffwechsel verstehen & Pflegeinterventionen",
    goals: uploadGoals,
    documents: emptyDocumentsMessage,
  },
  {
    title: "Thromboseprophylaxe",
    subtitle: "Risiken erkennen & Maßnahmen planen",
    goals: uploadGoals,
    documents: emptyDocumentsMessage,
  },
  {
    title: "Fiebererkrankungen",
    subtitle: "Fiebermanagement & Beobachtung",
    goals: uploadGoals,
    documents: emptyDocumentsMessage,
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
  {
    title: "Teach-back-Runde",
    description: "Erkläre ein Thema in 2 Minuten – so merkst du sofort Lücken.",
  },
  {
    title: "Lernlandkarte",
    description: "Baue ein Mindmap-Poster aus den PDF-Kapiteln als Überblick.",
  },
  {
    title: "Audio-Recap",
    description: "Sprich dir eine Zusammenfassung ein und höre sie unterwegs.",
  },
  {
    title: "Intervall-Mix",
    description: "Wechsle Themen im 20-Minuten-Takt, um Wissen zu vernetzen.",
  },
]

const placeholderQuizQuestion =
  "Quizfragen erscheinen, sobald PDFs im Ordner liegen."
const placeholderQuizAnswer =
  "Lege deine PDFs in den GitHub-Ordner, damit passende Fragen entstehen."

const quickChecks = [
  "Wunden",
  "Diabetes mellitus",
  "Thromboseprophylaxe",
  "Fiebererkrankungen",
].map((topic) => ({
  topic,
  question: placeholderQuizQuestion,
  answer: placeholderQuizAnswer,
}))

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
            Lege deine Unterlagen im GitHub-Ordner{" "}
            <span className="font-semibold">/pdf-uploads</span> ab. Lernkarten,
            Quizfragen und Zusammenfassungen werden daraus erzeugt, damit alles
            wirklich klausurrelevant bleibt.
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

        <section className="mb-12">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-2xl">PDFs im GitHub-Ordner</CardTitle>
              <CardDescription>
                Lege deine Unterlagen im Repository-Ordner{" "}
                <span className="font-semibold">/pdf-uploads</span> ab. Wir
                lesen sie anschließend und erstellen daraus passende
                Lerninhalte und Übungen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-dashed border-emerald-200 bg-emerald-50/60 p-4">
                <p className="text-sm font-medium text-gray-700">
                  PDFs über GitHub hinzufügen
                </p>
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-gray-600">
                  <li>
                    Öffne den Ordner{" "}
                    <span className="font-semibold">/pdf-uploads{" "}</span>im Repository.
                  </li>
                  <li>
                    Lade dort deine PDFs hoch (Skripte, Folien, Zusammenfassungen).
                  </li>
                  <li>
                    Wir lesen sie anschließend aus und erstellen Lernkarten, Quiz und Zusammenfassungen.
                  </li>
                </ol>
              </div>
              <div className="rounded-lg border border-gray-100 bg-white/70 p-3 text-xs text-gray-500">
                Noch keine PDFs im Ordner{" "}
                <span className="font-semibold">/pdf-uploads.{" "}</span>Lege
                dort Dateien ab, damit wir daraus Lernkarten und Quizfragen
                erstellen können.
              </div>
              <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-600">
                <div className="rounded-lg border border-gray-100 bg-white/70 p-3">
                  <p className="font-medium text-gray-700">Was passiert danach?</p>
                  <p className="mt-1 text-xs">
                    Die PDFs aus dem GitHub-Ordner werden analysiert, damit
                    Lernkarten, Quizfragen und Zusammenfassungen entstehen.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white/70 p-3">
                  <p className="font-medium text-gray-700">Empfohlene Inhalte</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-xs">
                    <li>Unterrichtsskripte und Leitlinien</li>
                    <li>Eigene Zusammenfassungen</li>
                    <li>Abbildungen oder Tabellen (PDF)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Lernfelder auf Basis deiner PDFs
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
                      Deine PDFs
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
                    Deine PDFs aus dem GitHub-Ordner werden hier gesammelt,
                    damit wir daraus Lernkarten, Quiz und Zusammenfassungen
                    erstellen.
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
            Quizfragen aus deinen PDFs
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
            Lege jederzeit neue PDFs in{" "}
            <span className="font-semibold">/pdf-uploads{" "}</span>ab, damit
            die Lernkarten und Quizfragen aktuell bleiben.
          </p>
          <Link href="/" className="text-primary hover:underline">
            Zur Startseite
          </Link>
        </footer>
      </div>
    </main>
  )
}
