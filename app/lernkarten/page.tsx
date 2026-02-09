import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const learningModes = [
  {
    title: "Aktiv erinnern",
    description:
      "Antwort zuerst selbst formulieren und erst danach die Lösung aufdecken.",
  },
  {
    title: "Laut erklären",
    description:
      "Sprich Antworten laut aus, damit du die Inhalte sicher abrufen kannst.",
  },
  {
    title: "Quellen checken",
    description:
      "Notiere die PDF-Quelle, damit du bei Unsicherheiten gezielt nachlesen kannst.",
  },
  {
    title: "Spaced Repetition",
    description:
      "Wiederhole schwierige Karten nach 1 Tag, 3 Tagen und 1 Woche.",
  },
]

const flashcardSets = [
  {
    title: "Wundversorgung",
    description:
      "Kernwissen zu Wundarten, Phasen und aseptischer Arbeitsweise.",
    cards: [
      {
        question: "Welche drei Phasen der Wundheilung musst du nennen?",
        answer:
          "Exsudationsphase (bis ca. 3 Tage), Proliferationsphase (1–14 Tage), Regenerationsphase (ab Tag 4, überlappend).",
        tip: "Merksatz: reinigen → aufbauen → stabilisieren.",
        source: "04 Wunden & Wundversorgung",
      },
      {
        question: "Woran erkennst du eine septische Wunde?",
        answer:
          "Infektionszeichen wie Rötung, Wärme, Schwellung, Schmerz oder eitriges Exsudat.",
        tip: "Aseptisch = keimfrei, septisch = infiziert.",
        source: "04 Wunden & Wundversorgung",
      },
      {
        question: "Wie unterscheiden sich primäre und sekundäre Wundheilung?",
        answer:
          "Primär heilt komplikationslos mit kleiner Narbe, sekundär langsamer bei verunreinigten/infizierten Wunden.",
        tip: "Sekundär = offenes Gewebe & längere Heilung.",
        source: "04 Wunden & Wundversorgung",
      },
      {
        question: "Was bedeutet Non-Touch-Technik beim Verbandswechsel?",
        answer:
          "Wundfläche oder sterile Materialien nicht mit den Händen berühren, nur mit sterilen Instrumenten arbeiten.",
        tip: "Kontamination vermeiden – sterile Fläche bleibt steril.",
        source: "04b Literatur Wunden und Drainagen",
      },
      {
        question: "Welche Wundarten werden unterschieden?",
        answer:
          "Mechanische, chemische, thermische und strahlenbedingte Wunden.",
        tip: "Merke: M-C-T-S = mechanisch, chemisch, thermisch, Strahlen.",
        source: "04 Wunden & Wundversorgung",
      },
      {
        question: "Was gehört in die Wunddokumentation?",
        answer:
          "Datum/Zeit, Wundgröße, Exsudat, Geruch, Schmerzen, Wundrand und verwendetes Material.",
        tip: "Kurz prüfen: Größe, Sekret, Rand, Schmerz.",
        source: "04 Wunden & Wundversorgung",
      },
    ],
  },
  {
    title: "Diabetes & Ernährung",
    description: "Blutzuckerwerte, Insulin und DGE-Regeln sicher abrufen.",
    cards: [
      {
        question: "Welche HbA1c-Grenze gilt als Diagnosegrenze?",
        answer: "HbA1c ≥ 6,5% gilt als Diagnosegrenze für Diabetes mellitus.",
        tip: "Immer zusammen mit Nüchtern-BZ beurteilen.",
        source: "1. Diabetes Präsentation",
      },
      {
        question: "Ab wann spricht man von einer Hypoglykämie?",
        answer: "Unter 50 mg/dl – Glukose geben, BZ kontrollieren, Arzt informieren.",
        tip: "Bei Bewusstlosigkeit stabile Seitenlage.",
        source: "1. Diabetes Präsentation",
      },
      {
        question: "Welche DGE-Regeln helfen besonders bei Typ-2-Diabetes?",
        answer:
          "Vollkorn wählen, Zucker sparen, 5 Portionen Obst/Gemüse, 1,5 Liter Wasser, max. 300–600 g Fleisch/Woche.",
        tip: "Regel 5: Abwechslung & ballaststoffreich essen.",
        source: "2.Die 10-Regeln-der-DGE",
      },
      {
        question: "Was sind die wichtigsten Schritte beim Insulin-PEN?",
        answer:
          "Nadel aufsetzen, Dosis einstellen, Injektionsstelle desinfizieren, injizieren, 10 Sekunden warten.",
        tip: "Injektionsstelle regelmäßig wechseln.",
        source: "5. Insulinspritzen mit dem PEN",
      },
      {
        question: "Welche Anzeichen sprechen für eine Hyperglykämie?",
        answer:
          "Starker Durst, häufiges Wasserlassen, Müdigkeit und erhöhte BZ-Werte.",
        tip: "BZ messen und ärztliche Anordnung prüfen.",
        source: "1. Diabetes Präsentation",
      },
      {
        question: "Wie hoch ist die empfohlene Flüssigkeitsmenge pro Tag?",
        answer: "Etwa 1,5 Liter Wasser oder ungesüßte Getränke pro Tag.",
        tip: "6–8 Gläser über den Tag verteilen.",
        source: "2.Die 10-Regeln-der-DGE",
      },
    ],
  },
  {
    title: "Thrombose & Prophylaxe",
    description:
      "Virchow-Trias, Warnzeichen und prophylaktische Maßnahmen trainieren.",
    cards: [
      {
        question: "Welche drei Faktoren umfasst die Virchow-Trias?",
        answer:
          "Verlangsamte Blutströmung, Gefäßwandschaden, erhöhte Gerinnungsneigung.",
        tip: "Strom – Wand – Gerinnung.",
        source: "2. Übersicht Virchow Trias",
      },
      {
        question: "Welche Symptome sprechen für eine tiefe Beinvenenthrombose?",
        answer:
          "Einseitige Schwellung, Wärmegefühl, Wadenschmerz, bläulich-rote Haut.",
        tip: "Bei Verdacht: Arzt informieren, Bettruhe.",
        source: "1. Definition Thrombose",
      },
      {
        question: "Nenne zwei aktive Maßnahmen zur Thromboseprophylaxe.",
        answer: "Atemübungen, aktive Fußbewegungen, Mobilisation, Beinvenen ausstreichen.",
        tip: "Muskelpumpe aktiv halten.",
        source: "Text - Bewegungsübungen",
      },
      {
        question: "Was ist das Ziel eines Kompressionsverbandes?",
        answer: "Venösen Rückfluss verbessern und Ödeme verhindern.",
        tip: "Druck von distal nach proximal aufbauen.",
        source: "Text - Kompressionsverband",
      },
      {
        question: "Was ist die Sofortmaßnahme bei Thromboseverdacht?",
        answer:
          "Arzt verständigen, absolute Bettruhe einhalten und den Oberkörper hochlagern.",
        tip: "Keine aktive Mobilisation ohne ärztliche Anordnung.",
        source: "1. Definition Thrombose",
      },
      {
        question: "Nenne typische Risikofaktoren für eine Thrombose.",
        answer:
          "Immobilität, Operationen, Dehydratation, Gefäßschäden und Gerinnungsstörungen.",
        tip: "Risikofaktoren gezielt in der Pflegeanamnese erfragen.",
        source: "3. Risikofaktoren einer Thrombose",
      },
    ],
  },
  {
    title: "Fieber & Beobachtung",
    description: "Fieberverlauf, Maßnahmen und Dokumentation abrufen.",
    cards: [
      {
        question: "Ab welcher Temperatur spricht man von Fieber?",
        answer: "Ab 38 °C Körpertemperatur.",
        tip: "Rektale Messung ist am verlässlichsten.",
        source: "Fieber",
      },
      {
        question: "Welche Phasen durchläuft ein Fieberverlauf?",
        answer: "Anstieg mit Schüttelfrost, Fieberhöhe, Fieberabfall mit Schwitzen.",
        tip: "Phase bestimmt die Pflegeintervention.",
        source: "Fieber",
      },
      {
        question: "Welche Maßnahmen helfen bei Fieber?",
        answer:
          "Wadenwickel, Waschungen, Flüssigkeit anbieten, ggf. Paracetamol/Ibuprofen nach ärztlicher Anordnung.",
        tip: "Vitalzeichen engmaschig dokumentieren.",
        source: "Fieber",
      },
      {
        question: "Wie häufig sollten Vitalzeichen bei Fieber kontrolliert werden?",
        answer: "Mindestens 2× täglich und bei Veränderungen zusätzlich.",
        tip: "Fieberkurve immer aktualisieren.",
        source: "Fieber",
      },
      {
        question: "Was ist bei Fieberabfall besonders wichtig?",
        answer:
          "Flüssigkeit ausgleichen, verschwitzte Kleidung wechseln und den Kreislauf beobachten.",
        tip: "Temperatur nach 30–60 Minuten erneut prüfen.",
        source: "Fieber",
      },
    ],
  },
]

const rotationPlan = [
  {
    step: "Warm-up",
    duration: "5 Min",
    focus: "Schwierige Karten markieren und die Quellen bereitlegen.",
  },
  {
    step: "Kartenrunde",
    duration: "20 Min",
    focus: "10–15 Karten laut beantworten und Lösungen überprüfen.",
  },
  {
    step: "Transfer",
    duration: "10 Min",
    focus: "Zu jeder Karte eine konkrete Pflegesituation formulieren.",
  },
  {
    step: "Review",
    duration: "5 Min",
    focus: "Fehler notieren und für die nächste Runde merken.",
  },
]

export default function LernkartenPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="text-center mb-10">
          <Badge className="mb-3">Lernkarten</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            Lernkarten-Decks für alle Themen
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Hier findest du umfangreiche Karteikarten aus den PDFs. Die Karten sind
            nach Themen sortiert und enthalten Antworten, Tipps und Quellen, damit
            du alles schnell nachschlagen kannst.
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
            So nutzt du die Lernkarten effektiv
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {learningModes.map((mode) => (
              <Card key={mode.title} className="bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg">{mode.title}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Lernkarten-Decks nach Themen
          </h2>
          <div className="space-y-8">
            {flashcardSets.map((set) => (
              <div key={set.title}>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {set.title}
                  </h3>
                  <p className="text-sm text-gray-600">{set.description}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {set.cards.map((card) => (
                    <Card key={card.question} className="bg-white/90">
                      <CardHeader>
                        <CardTitle className="text-base">{card.question}</CardTitle>
                        <CardDescription>Antwort zuerst selbst formulieren.</CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-600">
                        <details className="rounded-lg border border-dashed border-gray-200 bg-white/80 p-3">
                          <summary className="cursor-pointer text-sm font-medium text-gray-700">
                            Antwort anzeigen
                          </summary>
                          <p className="mt-2">{card.answer}</p>
                          <p className="mt-2 text-xs text-gray-500">{card.tip}</p>
                          <p className="mt-2 text-xs text-gray-400">
                            Quelle: {card.source}
                          </p>
                        </details>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            40-Minuten-Rotation für Lernkarten
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {rotationPlan.map((step) => (
              <Card key={step.step} className="bg-white/90">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">{step.step}</CardTitle>
                    <Badge variant="secondary">{step.duration}</Badge>
                  </div>
                  <CardDescription>{step.focus}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-3">
            Ergänze die PDFs im Ordner <span className="font-semibold">/pdf-uploads</span>,
            damit weitere Lernkarten entstehen.
          </p>
          <Link href="/lernplattform" className="text-primary hover:underline">
            Zur Lernplattform
          </Link>
        </footer>
      </div>
    </main>
  )
}
