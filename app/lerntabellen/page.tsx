import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const miniTables = [
  {
    title: "Wundheilungsphasen kompakt",
    description: "Kurzüberblick für den Pflegealltag.",
    headers: ["Phase", "Dauer", "Pflegefokus"],
    rows: [
      ["Exsudation", "0–3 Tage", "Reinigung, Blutstillung, Infektionsschutz"],
      ["Proliferation", "1–14 Tage", "Granulation, feuchte Wundumgebung"],
      ["Regeneration", "ab Tag 4", "Narbenbildung, Gewebe stabilisieren"],
    ],
  },
  {
    title: "Diabetes-Werte",
    description: "Merktabelle für Blutzucker und HbA1c.",
    headers: ["Messung", "Normal", "Kritisch"],
    rows: [
      ["Nüchtern-BZ", "80–100 mg/dl", "< 50 mg/dl = Hypoglykämie"],
      ["Postprandial (2h)", "< 140 mg/dl", "≥ 200 mg/dl = Hyperglykämie"],
      ["HbA1c", "< 6,5%", "≥ 6,5% = Diagnosegrenze"],
      ["oGTT", "< 140 mg/dl", "≥ 200 mg/dl = Diabetes"],
      ["BZ-Tagesziel", "90–180 mg/dl", "Unter- oder Überzuckerung"],
    ],
  },
  {
    title: "Thromboseprophylaxe",
    description: "Kleine Merktabelle zu Maßnahmen.",
    headers: ["Maßnahme", "Ziel", "Hinweis"],
    rows: [
      ["Bewegungsübungen", "Muskelpumpe aktivieren", "Mehrmals täglich anleiten"],
      ["Atemübungen", "Lungenbelüftung fördern", "Tiefes Ein- und Ausatmen"],
      ["Beinvenen ausstreichen", "Venösen Rückfluss unterstützen", "Immer herzaufwärts"],
      ["Hochlagerung", "Venösen Rückfluss fördern", "Beine leicht erhöht"],
      ["Kompression", "Ödeme verhindern", "Druck von distal nach proximal"],
    ],
  },
  {
    title: "Fiebermanagement",
    description: "Temperaturverlauf und Pflege im Blick.",
    headers: ["Phase", "Beobachtung", "Pflege"],
    rows: [
      ["Anstieg", "Schüttelfrost", "Warm halten, Flüssigkeit anbieten"],
      ["Höhe", "Heiß, trocken", "Ruhe sichern, Vitalzeichen kontrollieren"],
      ["Abfall", "Schwitzen", "Kühle Tücher, Flüssigkeit ausgleichen"],
      ["Erschöpfung", "Müdigkeit, Kreislauf schwach", "Schonung, Flüssigkeit, Kontrolle"],
    ],
  },
  {
    title: "Wunddokumentation",
    description: "Wichtige Angaben für eine vollständige Dokumentation.",
    headers: ["Parameter", "Beispiel", "Hinweis"],
    rows: [
      ["Wundgröße", "Länge × Breite", "Immer in cm angeben"],
      ["Exsudat", "gering/mittel/stark", "Farbe und Geruch ergänzen"],
      ["Wundrand", "gerötet/mazeriert", "Randveränderungen notieren"],
      ["Schmerz", "Skala 0–10", "Bei Zunahme Arzt informieren"],
    ],
  },
  {
    title: "Hypo- vs. Hyperglykämie",
    description: "Schnellvergleich für Notfallsituationen.",
    headers: ["Situation", "Anzeichen", "Sofortmaßnahme"],
    rows: [
      ["Hypoglykämie", "Zittern, Schwitzen, Unruhe", "Glukose geben, BZ prüfen"],
      [
        "Hyperglykämie",
        "Durst, Müdigkeit, trockene Haut",
        "BZ messen, Arzt informieren",
      ],
    ],
  },
  {
    title: "Virchow-Trias – Zuordnung",
    description: "Risikofaktoren den drei Ursachen zuordnen.",
    headers: ["Ursache", "Risikofaktoren", "Prophylaxe"],
    rows: [
      ["Blutströmung", "Immobilität, Bettlägerigkeit, Herzinsuffizienz", "Mobilisation, Bewegungsübungen"],
      ["Gefäßwand", "OP, Trauma, Entzündung, Varikosis", "Schonende Lagerung, Druckstellen vermeiden"],
      ["Gerinnung", "Dehydratation, Medikamente, Gerinnungsstörung", "Flüssigkeitszufuhr, Antikoagulation"],
    ],
  },
  {
    title: "Insulin-PEN Schrittfolge",
    description: "Korrekte Reihenfolge bei der Insulininjektion.",
    headers: ["Schritt", "Aktion", "Hinweis"],
    rows: [
      ["1", "Hände waschen & desinfizieren", "Hygiene beachten"],
      ["2", "Nadel aufsetzen, Funktionskontrolle", "2 IE in die Luft abgeben"],
      ["3", "Dosis einstellen", "Dosis laut Verordnung"],
      ["4", "Injektionsstelle wählen & desinfizieren", "Rotation: Bauch, Oberschenkel, Oberarm"],
      ["5", "Hautfalte bilden, im 90°-Winkel einstechen", "Nicht in Narbengewebe"],
      ["6", "Injizieren, 10 Sekunden warten", "Vollständige Abgabe sichern"],
      ["7", "Nadel entfernen, Abwurfbehälter", "Einstichstelle kurz drücken"],
    ],
  },
  {
    title: "Drainagen-Übersicht",
    description: "Wichtige Drainagearten und ihre Pflege.",
    headers: ["Art", "Prinzip", "Pflege"],
    rows: [
      ["Redon-Drainage", "Geschlossenes Vakuumsystem", "Fördermenge dokumentieren, Sog prüfen"],
      ["Robinson-Drainage", "Offene Ableitung", "Sekretfarbe beobachten, steril arbeiten"],
      ["T-Drainage", "Ableitung aus Gallenwegen", "Gallenfluss kontrollieren, Hautpflege"],
    ],
  },
  {
    title: "Diabetes-Spätfolgen",
    description: "Langzeitkomplikationen bei Diabetes mellitus.",
    headers: ["Komplikation", "Betroffenes Organ", "Vorbeugung"],
    rows: [
      ["Retinopathie", "Augen", "Regelmäßige Augenuntersuchung"],
      ["Nephropathie", "Nieren", "BZ-Einstellung, Blutdruckkontrolle"],
      ["Neuropathie", "Nerven (v.a. Füße)", "Fußpflege, Schuhwerk prüfen"],
      ["Diabetisches Fußsyndrom", "Füße", "Tägliche Fußinspektion"],
      ["Makroangiopathie", "Herz, Gefäße", "Bewegung, Ernährung, Rauchstopp"],
    ],
  },
]

const checklist = [
  "Nutze die Tabellen als schnellen Überblick vor der Praxisprüfung.",
  "Markiere schwierige Punkte und ergänze eigene Stichworte.",
  "Arbeite mit den PDF-Quellen, wenn du Details brauchst.",
]

export default function LerntabellenPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="text-center mb-10">
          <Badge className="mb-3">Lerntabellen</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            Kleine Lerntabellen für schnellen Überblick
          </h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Diese kompakten Tabellen fassen wichtige Fakten aus den PDFs zusammen.
            Perfekt für kurze Wiederholungen vor dem Lernen oder in der Pause.
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
            So arbeitest du mit Lerntabellen
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {checklist.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {miniTables.map((table) => (
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
            Die Lerntabellen stammen aus den PDFs im Ordner
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
