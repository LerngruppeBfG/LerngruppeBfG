import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const overviewTables = [
  {
    title: "Pflegeprozess im Überblick",
    description: "Strukturierter Ablauf für Planung und Evaluation.",
    headers: ["Schritt", "Ziel", "Dokumentation"],
    rows: [
      [
        "Assessment",
        "Daten sammeln, Risiken erkennen",
        "Vitalzeichen, Pflegeanamnese, Befunde",
      ],
      [
        "Pflegeplanung",
        "Ziele und Maßnahmen festlegen",
        "Pflegeziele, Maßnahmenplan, Verantwortlichkeiten",
      ],
      [
        "Durchführung",
        "Maßnahmen umsetzen",
        "Durchführungsnachweis, Beobachtungen",
      ],
      [
        "Evaluation",
        "Wirksamkeit prüfen",
        "Zielerreichung, Anpassungen, nächste Schritte",
      ],
    ],
  },
  {
    title: "Pflegemaßnahmen nach Themen",
    description: "Tabelle für zentrale Maßnahmen und Dokumentation.",
    headers: ["Thema", "Beobachtung", "Maßnahme", "Dokumentation"],
    rows: [
      [
        "Wundversorgung",
        "Wundrand, Exsudat, Schmerz",
        "Aseptischer Verbandswechsel, Non-Touch-Technik",
        "Wunddoku, Foto, Material",
      ],
      [
        "Diabetes",
        "BZ-Werte, Symptome",
        "BZ messen, Ernährung anpassen, Insulin verabreichen",
        "BZ-Kurve, Insulingabe, Beschwerden",
      ],
      [
        "Thrombose",
        "Schwellung, Schmerz, Hautfarbe",
        "Mobilisation, Kompression, Atemübungen",
        "Prophylaxenachweis, Beobachtung",
      ],
      [
        "Fieber",
        "Temperatur, Kreislauf",
        "Wadenwickel, Flüssigkeit, Ruhe",
        "Fieberkurve, Vitalzeichen",
      ],
    ],
  },
  {
    title: "Notfallmaßnahmen-Überblick",
    description: "Sofortmaßnahmen bei kritischen Pflegesituationen.",
    headers: ["Notfall", "Erkennung", "Sofortmaßnahme", "Weiteres Vorgehen"],
    rows: [
      [
        "Hypoglykämie",
        "BZ < 50 mg/dl, Zittern, Schwitzen",
        "Glukose geben, BZ messen",
        "Arzt informieren, Ursache klären",
      ],
      [
        "Lungenembolie",
        "Atemnot, Brustschmerz, Tachykardie",
        "Notruf, Oberkörper hochlagern, O₂",
        "Vitalzeichen überwachen",
      ],
      [
        "Thromboseverdacht",
        "Einseitige Schwellung, Wadenschmerz",
        "Arzt informieren, Bettruhe",
        "Keine Mobilisation ohne Anordnung",
      ],
      [
        "Hohes Fieber (> 39 °C)",
        "Heiße Haut, Tachykardie, Unruhe",
        "Wadenwickel, Flüssigkeit",
        "Arzt informieren, Antipyretika nach AO",
      ],
    ],
  },
  {
    title: "Verbandswechsel-Checkliste",
    description: "Schritt-für-Schritt-Ablauf eines aseptischen Verbandswechsels.",
    headers: ["Schritt", "Handlung", "Hinweis"],
    rows: [
      ["1", "Händedesinfektion durchführen", "Mind. 30 Sekunden einwirken"],
      ["2", "Material bereitstellen", "Sterile Kompressen, Desinfektionsmittel, Handschuhe"],
      ["3", "Alten Verband entfernen", "Unsterile Handschuhe verwenden"],
      ["4", "Wunde inspizieren & dokumentieren", "Größe, Exsudat, Geruch, Wundrand"],
      ["5", "Wundreinigung mit Non-Touch-Technik", "Von innen nach außen desinfizieren"],
      ["6", "Neuen Verband steril auflegen", "Sterile Pinzette verwenden"],
      ["7", "Verband fixieren & beschriften", "Datum, Uhrzeit, Handzeichen"],
    ],
  },
  {
    title: "Ernährung bei Diabetes – Praxistipps",
    description: "Konkrete Ernährungsempfehlungen basierend auf den DGE-Regeln.",
    headers: ["Mahlzeit", "Empfehlung", "Beispiel"],
    rows: [
      ["Frühstück", "Vollkorn, wenig Zucker", "Vollkornbrot mit Frischkäse, Obst"],
      ["Mittagessen", "Gemüse-Basis, mageres Eiweiß", "Gemüsepfanne mit Hähnchen, Reis"],
      ["Abendessen", "Leicht, ballaststoffreich", "Salat mit Fisch, Vollkornbrot"],
      ["Snacks", "Obst, Nüsse, Gemüsesticks", "Apfel, Mandeln, Karotten"],
      ["Getränke", "1,5 L Wasser/Tag, ungesüßt", "Wasser, Kräutertee"],
    ],
  },
]

const workflowNotes = [
  "Alle Tabellen können als Lernposter ausgedruckt werden.",
  "Ergänze eigene Beispiele aus der Praxis, um den Transfer zu sichern.",
  "Bei Unsicherheiten immer die PDF-Quellen prüfen.",
]

export default function TabellenPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-zinc-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="text-center mb-10">
          <Badge className="mb-3">Tabellen</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            Tabellen & Übersichten für die Prüfungsvorbereitung
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Ausführliche Tabellen helfen dir, Pflegeprozesse zu strukturieren und
            Maßnahmen korrekt zu dokumentieren. Nutze sie als Leitfaden für Klausuren
            und Praxis.
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
            Hinweise für den Einsatz
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {workflowNotes.map((note) => (
              <li key={note} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-6">
          {overviewTables.map((table) => (
            <Card key={table.title} className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg">{table.title}</CardTitle>
                <CardDescription>{table.description}</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="overflow-hidden rounded-lg border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500">
                      <tr>
                        {table.headers.map((header) => (
                          <th
                            key={header}
                            className="px-3 py-2 text-left font-semibold"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {table.rows.map((row, rowIndex) => (
                        <tr key={`${table.title}-row-${rowIndex}`}>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={`${table.title}-row-${rowIndex}-cell-${cellIndex}`}
                              className="px-3 py-2 text-gray-600"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-3">
            Die Tabellen basieren auf den PDFs aus dem Ordner
            <span className="font-semibold"> /pdf-uploads</span>.
          </p>
          <Link href="/lernplattform" className="text-primary hover:underline">
            Zur Lernplattform
          </Link>
        </footer>
      </div>
    </main>
  )
}
