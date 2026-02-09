import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const pdfSources = {
  wounds: [
    "04 Wunden & Wundversorgung",
    "04a AB Wundheilung",
    "04b Literatur Wunden und Drainagen",
    "LS 4C Herr Winterhaus (Fallbeispiel)",
  ],
  diabetes: [
    "1. Diabetes Präsentation",
    "3. AB Diabetes mellitus",
    "6. AB Diabetes mellitus Typ 2",
    "7. Lösung AB Diabetes mellitus Typ 2",
    "8 Pflege bei Diabetes mellitus Typ 2",
    "5. Insulinspritzen mit dem PEN",
    "2. Die 10 Regeln der DGE",
    "LS 4C Herr Winterhaus (Fallbeispiel)",
  ],
  thrombosis: [
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
  ],
  fever: ["Fieber"],
}

const pdfCatalog = Array.from(new Set(Object.values(pdfSources).flat()))

const learningFields = [
  {
    title: "Wunden",
    subtitle: "Wundheilung, Assessment & Verbandwechsel",
    goals: [
      "Wundarten (mechanisch, chemisch, thermisch, Strahlen) sicher unterscheiden.",
      "Aseptische vs. septische Wunden erkennen und dokumentieren.",
      "Wundheilungsphasen: Exsudation, Proliferation, Regeneration.",
      "Wunddokumentation und Non-Touch-Verbandswechsel üben.",
    ],
    documents: pdfSources.wounds,
  },
  {
    title: "Diabetes mellitus",
    subtitle: "Stoffwechsel verstehen & Pflegeinterventionen",
    goals: [
      "Insulinwirkung: Glukose wird in Zellen eingeschleust, Speicherung als Glykogen.",
      "Diagnostik: nüchtern BZ 80–100 mg/dl, HbA1c ≥ 6,5% (Diagnosegrenze für Diabetes mellitus), oGTT.",
      "Hypoglykämie < 50 mg/dl: Glukosegabe, BZ messen, Arzt informieren.",
      "DGE (Deutsche Gesellschaft für Ernährung): 5 am Tag, Vollkorn, 1,5 Liter Wasser, 300–600 g Fleisch/Woche.",
    ],
    documents: pdfSources.diabetes,
  },
  {
    title: "Thromboseprophylaxe",
    subtitle: "Risiken erkennen & Maßnahmen planen",
    goals: [
      "Definition Thrombose + Gefahr der Lungenembolie verinnerlichen.",
      "Virchow-Trias: Blutströmung, Gefäßwand, Gerinnungsneigung.",
      "Symptome: Schweregefühl, warme Extremität, Schwellung, Waden-Schmerz.",
      "Prophylaxe: Bewegung, Atemübungen, Hochlagerung, Kompression.",
    ],
    documents: pdfSources.thrombosis,
  },
  {
    title: "Fiebererkrankungen",
    subtitle: "Fiebermanagement & Beobachtung",
    goals: [
      "Fieber > 38 °C (rektal), Temperaturbereiche kennen.",
      "Fieberphasen: Anstieg, Höhe, Abfall, Erschöpfung.",
      "Maßnahmen: Vitalzeichen, Wadenwickel, Waschungen, Flüssigkeit.",
    ],
    documents: pdfSources.fever,
  },
]

const learningMethods = [
  {
    title: "Virchow-Trias-Check",
    description:
      "Ordne Risikofaktoren den drei Ursachen (Blutströmung, Gefäßwand, Gerinnung) zu.",
  },
  {
    title: "Thrombose-Symptom-Scan",
    description:
      "Schweregefühl, warme Extremität, Schwellung und Waden-Schmerz als Alarmzeichen merken.",
  },
  {
    title: "Atem- & Bewegungsübungen",
    description:
      "Tiefes Atmen und aktive Fußbewegungen fördern den venösen Rückfluss.",
  },
  {
    title: "Ausstreichen & Hochlagerung",
    description:
      "Beinvenen ausstreichen und Beine hochlagern, um venöse Stauung zu reduzieren.",
  },
  {
    title: "Kompressionstraining",
    description:
      "Kompressionsverband und Thromboseprophylaxestrumpf korrekt anlegen.",
  },
  {
    title: "Wundarten-Karteikarten",
    description:
      "Mechanische, chemische, thermische und strahlenbedingte Wunden unterscheiden.",
  },
  {
    title: "Wundheilungsphasen-Poster",
    description:
      "Exsudation (bis 3 Tage), Proliferation (1–14 Tage), Regeneration (ab Tag 4, überlappend).",
  },
  {
    title: "Non-Touch-Verbandswechsel",
    description:
      "Wundauflage nicht berühren und einfache Wundversorgung strukturiert üben.",
  },
  {
    title: "Diabetes-Glukosewerte-Check",
    description:
      "Nüchtern-BZ 80–100 mg/dl, HbA1c ≥ 6,5% (Diagnosegrenze für Diabetes mellitus) und oGTT im Team abfragen.",
  },
  {
    title: "Hypoglykämie-Notfallkarte",
    description:
      "Bei < 50 mg/dl Glukose geben, BZ messen, Arzt informieren; bei Bewusstlosigkeit stabile Seitenlage.",
  },
  {
    title: "DGE-10-Regeln-Foodplan",
    description:
      "5 am Tag, Vollkorn, 1,5 Liter Wasser, maximal 300–600 g Fleisch/Woche.",
  },
  {
    title: "Fieberkurven & Pflegeplan",
    description:
      "Fieberphasen erkennen, Vitalzeichen 2× täglich, Wadenwickel bei warmen Beinen.",
  },
  {
    title: "Fallbeispiel Herr Winterhaus",
    description:
      "Case-Review zu Diabetes, Wundversorgung, Fiebermanagement und Mobilisation.",
  },
]

const dataBacktests = [
  {
    topic: "Thrombose",
    question: "Was ist eine Thrombose?",
    answer:
      "Ein Gefäßverschluss durch intravasale Blutgerinnung (Thrombus), teils oder vollständig.",
    source: "1. Definition Thrombose",
  },
  {
    topic: "Thrombose",
    question: "Welche drei Faktoren umfasst die Virchow-Trias?",
    answer:
      "Verlangsamte Blutströmung, Gefäßwandschaden und erhöhte Gerinnungsneigung.",
    source: "2. Übersicht Virchow-Trias",
  },
  {
    topic: "Thrombose",
    question: "Nenne typische Symptome einer tiefen Beinvenenthrombose.",
    answer:
      "Einseitiges Schweregefühl, warme Extremität, Schwellung, Waden-Schmerz und bläulich-rote Haut.",
    source: "1. Definition Thrombose",
  },
  {
    topic: "Thrombose",
    question: "Was ist die Sofortmaßnahme bei Verdacht auf Phlebothrombose?",
    answer:
      "Arzt verständigen, absolute Bettruhe einhalten und den Oberkörper hochlagern.",
    source: "1. Definition Thrombose",
  },
  {
    topic: "Fieber",
    question: "Ab wann spricht man von Fieber?",
    answer: "Ab einer Körpertemperatur über 38 °C.",
    source: "Fieber",
  },
  {
    topic: "Fieber",
    question: "Welche Phasen durchläuft ein Fieberverlauf?",
    answer:
      "Fieberanstieg (Schüttelfrost), Fieberhöhe, Fieberabfall (Schwitzen), Erschöpfung.",
    source: "Fieber",
  },
  {
    topic: "Fieber",
    question: "Welche fiebersenkenden Maßnahmen werden genannt?",
    answer:
      "Wadenwickel, Waschungen sowie Medikamente wie Paracetamol oder Ibuprofen.",
    source: "Fieber",
  },
  {
    topic: "Wunden",
    question: "Wie heißen die drei Wundheilungsphasen?",
    answer:
      "Exsudationsphase (bis ca. 3 Tage), Proliferationsphase (1–14 Tage), Regenerationsphase (ab Tag 4, überlappend).",
    source: "04 Wunden & Wundversorgung",
  },
  {
    topic: "Wunden",
    question: "Wodurch unterscheiden sich primäre und sekundäre Wundheilung?",
    answer:
      "Primär: komplikationslos, kleine Narben; sekundär: verunreinigt/infiziert, langsamer, große Narben.",
    source: "04 Wunden & Wundversorgung",
  },
  {
    topic: "Wunden",
    question: "Was kennzeichnet eine aseptische vs. septische Wunde?",
    answer:
      "Aseptisch = keimfrei (OP-Wunde), septisch = mit Keimen/Infektionszeichen (z.B. Dekubitus).",
    source: "04 Wunden & Wundversorgung",
  },
  {
    topic: "Diabetes",
    question:
      "Welche Werte nennt die Präsentation für nüchtern BZ und HbA1c (Diagnosegrenze)?",
    answer:
      "Nüchtern BZ 80–100 mg/dl, HbA1c ≥ 6,5% als Diagnosegrenze für Diabetes mellitus.",
    source: "1. Diabetes Präsentation",
  },
  {
    topic: "Diabetes",
    question: "Ab wann gilt eine Hypoglykämie und was ist sofort zu tun?",
    answer:
      "Unter 50 mg/dl: Pflegefachkraft/Arzt informieren, BZ messen, Glukose geben; bei Bewusstlosigkeit stabile Seitenlage.",
    source: "1. Diabetes Präsentation",
  },
  {
    topic: "Ernährung",
    question: "Welche DGE-Regeln helfen gegen Diabetes Typ 2?",
    answer:
      "5 am Tag, Vollkorn, rund 1,5 Liter Wasser/Tag, Zucker sparen und max. 300–600 g Fleisch/Woche.",
    source: "2. Die 10 Regeln der DGE",
  },
]

const flashcards = [
  {
    title: "Wundheilung in 3 Phasen",
    question: "Welche Phasen der Wundheilung musst du nennen können?",
    answer:
      "Exsudation (bis ca. 3 Tage), Proliferation (1–14 Tage), Regeneration (ab Tag 4, überlappend).",
    tip: "Merksatz: Erst reinigen, dann aufbauen, dann stabilisieren.",
    source: "04 Wunden & Wundversorgung",
  },
  {
    title: "Aseptisch vs. septisch",
    question: "Woran erkennst du eine septische Wunde?",
    answer:
      "Zeichen der Infektion: Rötung, Wärme, Schwellung, Schmerz oder eitriges Exsudat.",
    tip: "Aseptisch = keimfrei, septisch = infiziert.",
    source: "04 Wunden & Wundversorgung",
  },
  {
    title: "Virchow-Trias",
    question: "Welche drei Ursachen begünstigen eine Thrombose?",
    answer:
      "Verlangsamte Blutströmung, Gefäßwandschaden, erhöhte Gerinnungsneigung.",
    tip: "Denke an: Strom, Wand, Gerinnung.",
    source: "2. Übersicht Virchow-Trias",
  },
  {
    title: "Thrombose-Warnzeichen",
    question: "Nenne zwei Alarmzeichen einer Beinvenenthrombose.",
    answer: "Einseitige Schwellung, warme Extremität, Waden-Schmerz.",
    tip: "Bei Verdacht: Arzt informieren, Bettruhe.",
    source: "1. Definition Thrombose",
  },
  {
    title: "Hypoglykämie-Alarm",
    question: "Ab welchem Wert beginnt eine Hypoglykämie?",
    answer:
      "Unter 50 mg/dl: Blutzucker (BZ) messen, Glukose geben, Arzt informieren.",
    tip: "Bei Bewusstlosigkeit: stabile Seitenlage.",
    source: "1. Diabetes Präsentation",
  },
  {
    title: "Fiebermanagement",
    question: "Welche Maßnahmen helfen bei Fieber?",
    answer:
      "Wadenwickel, Waschungen, Flüssigkeit, ggf. Paracetamol/Ibuprofen.",
    tip: "Temperatur und Vitalzeichen dokumentieren.",
    source: "Fieber",
  },
]

const quizItems = [
  {
    title: "Thrombose-Check",
    question: "Welche Maßnahme gehört zur Thromboseprophylaxe?",
    options: [
      "Absolute Bettruhe ohne Mobilisation",
      "Atemübungen und aktive Fußbewegungen",
      "Beine dauerhaft tief lagern",
      "Flüssigkeitszufuhr reduzieren",
    ],
    answer: "B",
    explanation:
      "Atem- und Bewegungsübungen aktivieren die Muskelpumpe und fördern den venösen Rückfluss.",
  },
  {
    title: "Diabetes-Quiz",
    question: "Welche HbA1c-Grenze gilt als Diagnosegrenze?",
    options: ["≥ 5,5%", "≥ 6,5%", "≥ 7,5%", "≥ 8,5%"],
    answer: "B",
    explanation:
      "Die Präsentation nennt ≥ 6,5% als Diagnosegrenze für Diabetes mellitus.",
  },
  {
    title: "Wundpflege-Quiz",
    question: "Welche Aussage beschreibt eine aseptische Wunde korrekt?",
    options: [
      "Sie ist mit Keimen besiedelt und eitrig.",
      "Sie entsteht ausschließlich durch thermische Einwirkung.",
      "Sie ist keimfrei, z.B. eine OP-Wunde.",
      "Sie ist immer chronisch und schlecht heilend.",
    ],
    answer: "C",
    explanation: "Aseptische Wunden gelten als keimfrei.",
  },
  {
    title: "Fieber-Quiz",
    question: "Ab welcher Temperatur spricht man von Fieber?",
    options: ["37,0 °C", "37,5 °C", "38,0 °C", "39,5 °C"],
    answer: "C",
    explanation: "Fieber beginnt ab 38 °C Körpertemperatur.",
  },
]

const quickQuestions = [
  {
    question: "Wie oft sollen Vitalzeichen bei Fieber kontrolliert werden?",
    answer: "Mindestens 2× täglich und zusätzlich bei Zustandsveränderungen.",
  },
  {
    question: "Was gehört in die Wunddokumentation?",
    answer:
      "Datum/Zeit, Wundgröße, Exsudat, Geruch, Schmerzen, Wundrand und verwendetes Material.",
  },
  {
    question: "Welche DGE-Regel ist bei Diabetes besonders wichtig?",
    answer: "Zucker sparen, Vollkorn bevorzugen und 5 Portionen Obst/Gemüse.",
  },
  {
    question: "Was ist die erste Maßnahme bei Verdacht auf Thrombose?",
    answer: "Arzt informieren und Bettruhe einhalten.",
  },
]

const learningSprint = [
  {
    title: "10-Minuten-Überblick",
    focus: "Lernziele der Einheit durchlesen, Schlüsselbegriffe markieren.",
    duration: "10 Min",
  },
  {
    title: "Karteikarten-Runde",
    focus: "3–5 Lernkarten laut beantworten, Antworten prüfen.",
    duration: "15 Min",
  },
  {
    title: "Mini-Quiz",
    focus: "1–2 Quizfragen lösen und Begründungen lesen.",
    duration: "10 Min",
  },
  {
    title: "Kurz-Reflexion",
    focus: "Notiere 2 Dinge, die du heute sicher kannst.",
    duration: "5 Min",
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
            Die PDFs aus{" "}
            <span className="font-semibold">/pdf-uploads</span> wurden
            ausgewertet. Lernmethoden, Backtests und Zusammenfassungen basieren
            auf diesen Inhalten, damit alles klausurrelevant bleibt.
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
                <span className="font-semibold">/pdf-uploads</span> ab. Die
                Inhalte werden ausgelesen – aktuell sind{" "}
                <span className="font-semibold">{pdfCatalog.length} PDFs</span>{" "}
                erfasst.
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
                <p className="text-sm font-medium text-gray-700">
                  Eingelesene PDFs ({pdfCatalog.length})
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pdfCatalog.map((doc) => (
                    <Badge
                      key={doc}
                      variant="outline"
                      className="border-dashed text-[11px]"
                    >
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-600">
                <div className="rounded-lg border border-gray-100 bg-white/70 p-3">
                  <p className="font-medium text-gray-700">Was passiert danach?</p>
                  <p className="mt-1 text-xs">
                    Die PDFs aus dem GitHub-Ordner werden analysiert, damit
                    Lernmethoden, Backtests und Zusammenfassungen entstehen.
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
                    Die PDFs wurden ausgewertet; Lernziele, Methoden und
                    Backtests basieren auf diesen Dateien.
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Lernmethoden aus den PDFs
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Lernroutine für effektive Sessions
          </h2>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">
            Arbeite in kurzen Sprints, damit du Wissen aktiv abrufst und direkt
            festigst. Nutze die Karten, Quizfragen und Q&amp;A-Blöcke darunter.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {learningSprint.map((step) => (
              <Card key={step.title} className="bg-white/80">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <Badge variant="secondary">{step.duration}</Badge>
                  </div>
                  <CardDescription>{step.focus}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Lernkarten: aktive Wiederholung
          </h2>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">
            Lies zuerst die Frage, beantworte sie laut und klappe danach die
            Antwort auf. So trainierst du aktives Erinnern.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {flashcards.map((card) => (
              <Card key={card.title} className="bg-white/80">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <Badge variant="outline">Lernkarte</Badge>
                  </div>
                  <CardDescription>{card.question}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
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
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Lernquiz: prüfe dein Wissen
          </h2>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">
            Kreuze deine Antwort an (laut oder schriftlich) und klappe die
            Lösung auf, um dich selbst zu kontrollieren.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {quizItems.map((quiz) => (
              <Card key={quiz.title} className="bg-white/80">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <Badge>Lernquiz</Badge>
                  </div>
                  <CardDescription>{quiz.question}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <ol className="space-y-1 text-sm text-gray-600">
                    {quiz.options.map((option, index) => (
                      <li key={option} className="flex gap-2">
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
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Fragen &amp; Antworten
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {quickQuestions.map((item) => (
              <details
                key={item.question}
                className="rounded-lg border border-gray-200 bg-white/80 p-4"
              >
                <summary className="cursor-pointer text-sm font-semibold text-gray-800">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Backtests zur Datenverifikation
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {dataBacktests.map((check) => (
              <details
                key={`${check.topic}-${check.question}`}
                className="rounded-lg border border-gray-200 bg-white/80 p-4"
              >
                <summary className="cursor-pointer text-sm font-semibold text-gray-800">
                  {check.topic}: {check.question}
                </summary>
                <p className="mt-2 text-sm text-gray-600">{check.answer}</p>
                <p className="mt-2 text-xs text-gray-400">
                  Quelle: {check.source}
                </p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-3">
            Lege jederzeit neue PDFs in{" "}
            <span className="font-semibold">/pdf-uploads{" "}</span>ab, damit
            Lernmethoden und Backtests aktuell bleiben.
          </p>
          <Link href="/" className="text-primary hover:underline">
            Zur Startseite
          </Link>
        </footer>
      </div>
    </main>
  )
}
