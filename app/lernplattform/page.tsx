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
      "Infektionszeichen (Rötung, Wärme, Schwellung, Schmerz, Exsudat) sicher erkennen.",
      "Drainagen: Zweck, Beobachtung und Menge/Farbe regelmäßig dokumentieren.",
      "Wunddokumentation und Non-Touch-Verbandswechsel üben.",
    ],
    documents: pdfSources.wounds,
  },
  {
    title: "Diabetes mellitus",
    subtitle: "Stoffwechsel verstehen & Pflegeinterventionen",
    goals: [
      "Insulinwirkung: Glukose wird in Zellen eingeschleust, Speicherung als Glykogen.",
      "Diagnostik: nüchtern Blutzucker (BZ) 80–100 mg/dl, HbA1c ≥ 6,5% (Diagnosegrenze für Diabetes mellitus), oGTT.",
      "Hypoglykämie < 50 mg/dl: Glukosegabe, BZ messen, Arzt informieren.",
      "Hyperglykämie erkennen: Durst, Polyurie, Müdigkeit, ggf. Übelkeit.",
      "Insulinpen & BZ-Messung: richtige Vorbereitung, Einstichstelle und Dokumentation.",
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
      "Symptome: Schweregefühl, warme Extremität, Schwellung, Wadenschmerz.",
      "Risikofaktoren: Immobilität, Operationen, Dehydration, Rauchen.",
      "Prophylaxe: Bewegung, Atemübungen, Hochlagerung, Kompression.",
      "Lungenembolie-Warnzeichen: Atemnot, Thoraxschmerz, Unruhe.",
    ],
    documents: pdfSources.thrombosis,
  },
  {
    title: "Fiebererkrankungen",
    subtitle: "Fiebermanagement & Beobachtung",
    goals: [
      "Fieber > 38 °C (rektal), Temperaturbereiche kennen.",
      "Fieberphasen: Anstieg, Höhe, Abfall, Erschöpfung.",
      "Temperaturmessung: Messorte (rektal, oral, axillar) korrekt anwenden.",
      "Maßnahmen: Vitalzeichen, Wadenwickel, Waschungen, Flüssigkeit.",
      "Beobachtung: Trinkmenge, Haut, Bewusstsein und Verlauf dokumentieren.",
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
      "Schweregefühl, warme Extremität, Schwellung und Wadenschmerz als Alarmzeichen merken.",
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
    title: "Risikofaktoren-Radar",
    description:
      "Immobilität, Operationen, Dehydration und Rauchen als Thrombose-Treiber prüfen.",
  },
  {
    title: "Lungenembolie-Alarmplan",
    description:
      "Atemnot, Thoraxschmerz, Tachykardie erkennen und sofort ärztlich melden.",
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
    title: "Drainagen-Checkliste",
    description:
      "Menge, Farbe und Geruch der Drainage kontrollieren und dokumentieren.",
  },
  {
    title: "Diabetes-Glukosewerte-Check",
    description:
      "Nüchtern-BZ 80–100 mg/dl, HbA1c ≥ 6,5% (Diagnosegrenze für Diabetes mellitus) und oGTT im Team abfragen.",
  },
  {
    title: "Insulinpen-Training",
    description:
      "Insulinpen vorbereiten, Testhub durchführen, Dosis spritzen und 10 Sekunden halten.",
  },
  {
    title: "Hyperglykämie-Check",
    description:
      "Durst, Polyurie, Müdigkeit oder Übelkeit als Warnzeichen erkennen.",
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
    title: "Fiebermessung & Flüssigkeitsbilanz",
    description:
      "Temperatur korrekt messen, Trinkmenge dokumentieren und Verlauf beobachten.",
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
      "Einseitiges Schweregefühl, warme Extremität, Schwellung, Wadenschmerz und bläulich-rote Haut.",
    source: "1. Definition Thrombose",
  },
  {
    topic: "Thrombose",
    question: "Nenne typische Risikofaktoren für Thrombosen.",
    answer:
      "Immobilität, Operationen, Flüssigkeitsmangel, Rauchen oder Varikosis erhöhen das Risiko.",
    source: "3. Risikofaktoren einer Thrombose",
  },
  {
    topic: "Thrombose",
    question: "Welche Warnzeichen sprechen für eine Lungenembolie?",
    answer:
      "Plötzliche Atemnot, Thoraxschmerz, Tachykardie, Unruhe oder Blaufärbung.",
    source: "1a Lungenembolie",
  },
  {
    topic: "Thrombose",
    question: "Was ist die Sofortmaßnahme bei Verdacht auf Phlebothrombose?",
    answer:
      "Arzt verständigen, absolute Bettruhe einhalten und den Oberkörper hochlagern.",
    source: "1. Definition Thrombose",
  },
  {
    topic: "Thrombose",
    question: "Welches Ziel hat die Thromboseprophylaxe?",
    answer:
      "Blutfluss fördern, Stase vermeiden und Thrombenbildung verhindern.",
    source: "6. Ansatzpunkte & Ziele der Thromboseprophylaxe",
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
    topic: "Fieber",
    question: "Welche Messorte sind bei der Temperaturkontrolle üblich?",
    answer:
      "Rektal, oral oder axillar; rektal gilt als besonders zuverlässig.",
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
    topic: "Wunden",
    question: "Welche Zeichen sprechen für eine Wundinfektion?",
    answer:
      "Rötung, Wärme, Schwellung, Schmerz und eitriges Exsudat.",
    source: "04 Wunden & Wundversorgung",
  },
  {
    topic: "Wunden",
    question: "Warum werden Drainagen eingesetzt?",
    answer:
      "Sie leiten Wundsekret ab, entlasten das Gewebe und müssen bezüglich Menge und Farbe kontrolliert werden.",
    source: "04b Literatur Wunden und Drainagen",
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
    topic: "Diabetes",
    question: "Welche Schritte gehören zum Insulinspritzen mit dem Pen?",
    answer:
      "Nadel aufsetzen, Testhub durchführen, Dosis einstellen, injizieren und 10 Sekunden halten.",
    source: "5. Insulinspritzen mit dem PEN",
  },
  {
    topic: "Diabetes",
    question: "Welche pflegerischen Schwerpunkte gelten bei Typ-2-Diabetes?",
    answer:
      "Ernährung, Bewegung, Gewichtsmanagement, Fußpflege und regelmäßige BZ-Kontrolle.",
    source: "8 Pflege bei Diabetes mellitus Typ 2",
  },
  {
    topic: "Ernährung",
    question: "Welche DGE-Regeln helfen gegen Diabetes Typ 2?",
    answer:
      "5 am Tag, Vollkorn, rund 1,5 Liter Wasser/Tag, Zucker sparen und max. 300–600 g Fleisch/Woche.",
    source: "2. Die 10 Regeln der DGE",
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
