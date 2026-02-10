export type LearningMethod = {
  slug: string
  title: string
  description: string
  focus: string
  steps: string[]
  topics: string[]
}

export const learningMethods: LearningMethod[] = [
  {
    slug: "virchow-trias-check",
    title: "Virchow-Trias-Check",
    description:
      "Ordne Risikofaktoren den drei Ursachen (Blutströmung, Gefäßwand, Gerinnung) zu.",
    focus:
      "Du trainierst das schnelle Erkennen der drei Hauptursachen einer Thrombose.",
    steps: [
      "Schreibe die drei Bereiche Blutströmung, Gefäßwand und Gerinnung auf.",
      "Ordne mindestens drei Risikofaktoren je Bereich zu und begründe kurz warum.",
      "Vergleiche deine Zuordnung mit dem PDF und ergänze fehlende Punkte.",
    ],
    topics: ["2. Übersicht Virchow-Trias", "3. Risikofaktoren einer Thrombose"],
  },
  {
    slug: "thrombose-symptom-scan",
    title: "Thrombose-Symptom-Scan",
    description:
      "Schweregefühl, warme Extremität, Schwellung und Wadenschmerz als Alarmzeichen merken.",
    focus:
      "Du baust eine schnelle Checkliste auf, um Warnzeichen sicher zu erkennen.",
    steps: [
      "Notiere die typischen Symptome einer Beinvenenthrombose in Stichpunkten.",
      "Markiere im Skript, welche Symptome als Alarmzeichen gelten.",
      "Übe das Abfragen der Symptome laut anhand eines Fallbeispiels.",
    ],
    topics: ["1. Definition Thrombose", "3. Risikofaktoren einer Thrombose"],
  },
  {
    slug: "atem-bewegungsuebungen",
    title: "Atem- & Bewegungsübungen",
    description:
      "Tiefes Atmen und aktive Fußbewegungen fördern den venösen Rückfluss.",
    focus:
      "Du lernst einfache Übungen, die die Muskelpumpe aktivieren und Thrombosen vorbeugen.",
    steps: [
      "Führe 3–5 tiefe Atemzüge durch und zähle dabei die Atemphasen.",
      "Bewege die Füße aktiv (Fußkreisen und Zehenziehen) für 1–2 Minuten.",
      "Notiere, wie du die Übungen in die Pflegeplanung einbaust.",
    ],
    topics: ["Text - Atemübungen", "Text - Bewegungsübungen"],
  },
  {
    slug: "ausstreichen-hochlagerung",
    title: "Ausstreichen & Hochlagerung",
    description:
      "Beinvenen ausstreichen und Beine hochlagern, um venöse Stauung zu reduzieren.",
    focus:
      "Du übst Maßnahmen zur Entlastung der Beinvenen und dokumentierst die Wirkung.",
    steps: [
      "Simuliere das Ausstreichen der Beinvenen in einem Schritt-für-Schritt-Ablauf.",
      "Plane eine Hochlagerung mit korrekter Lagerungshöhe (Herzniveau beachten).",
      "Formuliere, wann die Maßnahmen kontraindiziert sind.",
    ],
    topics: ["Text - Ausstreichen der Beinvenen", "Text - Hochlagerung der Beine"],
  },
  {
    slug: "kompressionstraining",
    title: "Kompressionstraining",
    description:
      "Kompressionsverband und Thromboseprophylaxestrumpf korrekt anlegen.",
    focus:
      "Du trainierst das Anlegen von Kompressionsmaterialien und achtest auf Druckverteilung.",
    steps: [
      "Erstelle eine Checkliste für das Anlegen eines Kompressionsverbandes.",
      "Übe das richtige Abmessen und Anziehen eines Prophylaxestrumpfes.",
      "Notiere die wichtigsten Haut- und Durchblutungskontrollen.",
    ],
    topics: [
      "Text - Kompressionsverband",
      "Text - Medizinischer Thromboseprophylaxestrumpf",
    ],
  },
  {
    slug: "wundarten-karteikarten",
    title: "Wundarten-Karteikarten",
    description:
      "Mechanische, chemische, thermische und strahlenbedingte Wunden unterscheiden.",
    focus:
      "Du lernst, Wundarten schnell zuzuordnen und typische Beispiele zu nennen.",
    steps: [
      "Erstelle vier Karteikarten für die unterschiedlichen Wundarten.",
      "Notiere pro Karte je zwei Beispiele und typische Ursachen.",
      "Teste dich selbst mit einer schnellen Zuordnungsrunde.",
    ],
    topics: ["04 Wunden & Wundversorgung", "04b Literatur Wunden und Drainagen"],
  },
  {
    slug: "wundheilungsphasen-poster",
    title: "Wundheilungsphasen-Poster",
    description:
      "Exsudation (bis 3 Tage), Proliferation (1–14 Tage), Regeneration (ab Tag 4, überlappend).",
    focus:
      "Du visualisierst die Wundheilung, um Zeiträume und Aufgaben sicher zu erinnern.",
    steps: [
      "Skizziere die drei Phasen mit Zeitangaben auf einem Poster.",
      "Füge zu jeder Phase die wichtigsten Pflegeziele hinzu.",
      "Hänge das Poster sichtbar auf und wiederhole die Phasen täglich.",
    ],
    topics: ["04a AB Wundheilung"],
  },
  {
    slug: "non-touch-verbandswechsel",
    title: "Non-Touch-Verbandswechsel",
    description:
      "Wundauflage nicht berühren und einfache Wundversorgung strukturiert üben.",
    focus:
      "Du trainierst den sterilen Ablauf und minimierst Kontaminationsrisiken.",
    steps: [
      "Schreibe die Materialien auf, die du vor dem Verbandswechsel bereitlegst.",
      "Übe den Ablauf mit Fokus auf die Non-Touch-Technik.",
      "Notiere die wichtigsten Dokumentationspunkte nach dem Wechsel.",
    ],
    topics: ["04 Wunden & Wundversorgung"],
  },
  {
    slug: "diabetes-glukosewerte-check",
    title: "Diabetes-Glukosewerte-Check",
    description:
      "Nüchtern-BZ 80–100 mg/dl, HbA1c ≥ 6,5% (Diagnosegrenze für Diabetes mellitus) und oGTT im Team abfragen.",
    focus:
      "Du merkst dir die entscheidenden Laborwerte und kannst sie sicher wiedergeben.",
    steps: [
      "Notiere die Referenzwerte für Nüchtern-BZ, HbA1c und oGTT.",
      "Erstelle eine Mini-Abfrage für Lernpartner:innen.",
      "Markiere Abweichungen, die als Diagnosekriterium gelten.",
    ],
    topics: ["1. Diabetes Präsentation", "3. AB Diabetes mellitus"],
  },
  {
    slug: "hypoglykaemie-notfallkarte",
    title: "Hypoglykämie-Notfallkarte",
    description:
      "Bei < 50 mg/dl Glukose geben, BZ messen, Arzt informieren; bei Bewusstlosigkeit stabile Seitenlage.",
    focus:
      "Du sicherst die Sofortmaßnahmen und kannst sie im Notfall schnell abrufen.",
    steps: [
      "Schreibe die Sofortmaßnahmen in der richtigen Reihenfolge auf eine Karte.",
      "Ergänze Warnzeichen wie Zittern, Schwitzen oder Bewusstseinsstörungen.",
      "Übe die Situation anhand eines kurzen Rollenspiels.",
    ],
    topics: ["1. Diabetes Präsentation", "8 Pflege bei Diabetes mellitus Typ 2"],
  },
  {
    slug: "dge-10-regeln-foodplan",
    title: "DGE-10-Regeln-Foodplan",
    description:
      "5 am Tag, Vollkorn, 1,5 Liter Wasser, maximal 300–600 g Fleisch/Woche.",
    focus:
      "Du leitest Ernährungsempfehlungen aus den DGE-Regeln ab und planst Mahlzeiten.",
    steps: [
      "Liste die 10 DGE-Regeln stichpunktartig auf.",
      "Plane einen Tagesplan mit Obst, Gemüse und Vollkornanteil.",
      "Notiere, wie viel Flüssigkeit empfohlen wird.",
    ],
    topics: ["2. Die 10 Regeln der DGE"],
  },
  {
    slug: "fieberkurven-pflegeplan",
    title: "Fieberkurven & Pflegeplan",
    description:
      "Fieberphasen erkennen, Vitalzeichen 2× täglich, Wadenwickel bei warmen Beinen.",
    focus:
      "Du lernst, Fieberverläufe zu dokumentieren und passende Maßnahmen zu planen.",
    steps: [
      "Zeichne eine einfache Fieberkurve mit den drei Phasen.",
      "Lege fest, wann Vitalzeichenkontrollen stattfinden sollen.",
      "Notiere geeignete Pflegeinterventionen für jede Phase.",
    ],
    topics: ["Fieber"],
  },
  {
    slug: "fallbeispiel-herr-winterhaus",
    title: "Fallbeispiel Herr Winterhaus",
    description:
      "Case-Review zu Diabetes, Wundversorgung, Fiebermanagement und Mobilisation.",
    focus:
      "Du verknüpfst mehrere Themenbereiche und trainierst pflegerisches Denken.",
    steps: [
      "Lies das Fallbeispiel und markiere die relevanten Probleme.",
      "Leite daraus Pflegeziele für Wundversorgung, Diabetes und Fieber ab.",
      "Notiere mindestens drei Maßnahmen zur Mobilisation.",
    ],
    topics: ["LS 4C Herr Winterhaus (Fallbeispiel)", "04 Wunden & Wundversorgung"],
  },
  {
    slug: "insulinpen-schritt-fuer-schritt",
    title: "Insulin-PEN Schritt für Schritt",
    description:
      "Lerne den korrekten Umgang mit dem Insulin-PEN und übe die Injektionsschritte.",
    focus:
      "Du trainierst die praxisnahe Handhabung des Insulin-PEN und vermeidest typische Fehler.",
    steps: [
      "Lege alle benötigten Materialien bereit (PEN, Nadel, Desinfektionsmittel).",
      "Übe die Schrittfolge: Nadel aufsetzen, Dosis einstellen, Injektionsstelle desinfizieren.",
      "Injiziere und warte 10 Sekunden, bevor du die Nadel entfernst.",
      "Notiere, warum die Injektionsstelle regelmäßig gewechselt werden muss.",
    ],
    topics: ["5. Insulinspritzen mit dem PEN", "1. Diabetes Präsentation"],
  },
  {
    slug: "lungenembolie-notfall",
    title: "Lungenembolie-Notfallkarte",
    description:
      "Erkenne die Warnzeichen einer Lungenembolie und leite Sofortmaßnahmen ein.",
    focus:
      "Du sicherst lebensrettende Erstmaßnahmen und verstehst den Zusammenhang mit Thrombosen.",
    steps: [
      "Notiere die typischen Symptome einer Lungenembolie (Atemnot, Brustschmerz, Tachykardie).",
      "Erstelle eine Notfallkarte mit den Sofortmaßnahmen in der richtigen Reihenfolge.",
      "Erkläre den Zusammenhang zwischen Beinvenenthrombose und Lungenembolie.",
    ],
    topics: ["1a Lungenembolie", "1. Definition Thrombose"],
  },
  {
    slug: "venensystem-anatomie",
    title: "Venensystem der Beine verstehen",
    description:
      "Lerne den Aufbau des Venensystems mit tiefen und oberflächlichen Venen sowie der Muskelpumpe.",
    focus:
      "Du verstehst, warum Bewegung und Kompression die Thromboseprophylaxe unterstützen.",
    steps: [
      "Zeichne eine Skizze des Beinvenensystems mit tiefen und oberflächlichen Venen.",
      "Markiere die Lage der Venenklappen und die Richtung des Blutflusses.",
      "Erkläre die Funktionsweise der Muskelpumpe und warum Immobilität gefährlich ist.",
    ],
    topics: ["1b Venensystem der Beine", "1. Definition Thrombose"],
  },
  {
    slug: "diabetes-spaetfolgen-mindmap",
    title: "Diabetes-Spätfolgen Mindmap",
    description:
      "Erstelle eine Mindmap zu den Langzeitkomplikationen bei Diabetes mellitus.",
    focus:
      "Du lernst, warum eine gute BZ-Einstellung langfristig wichtig ist.",
    steps: [
      "Schreibe Diabetes mellitus in die Mitte und zeichne Äste für jede Spätfolge.",
      "Notiere zu jeder Spätfolge: betroffenes Organ, Symptome und Prävention.",
      "Ergänze die Mindmap mit Pflegemaßnahmen zur Vorbeugung (Fußpflege, Augencheck).",
    ],
    topics: ["3. AB Diabetes mellitus", "8 Pflege bei Diabetes mellitus Typ 2"],
  },
  {
    slug: "ernaehrungsprotokoll",
    title: "Ernährungsprotokoll erstellen",
    description:
      "Plane und dokumentiere eine diabetesgerechte Tagesernährung nach DGE-Regeln.",
    focus:
      "Du übst die praktische Umsetzung der Ernährungsempfehlungen im Pflegealltag.",
    steps: [
      "Erstelle einen Tages-Ernährungsplan mit 3 Hauptmahlzeiten und 2 Snacks.",
      "Prüfe den Plan anhand der 10 DGE-Regeln (Vollkorn, 5 am Tag, Flüssigkeit).",
      "Berechne die ungefähre Kohlenhydratmenge und diskutiere die Auswirkung auf den BZ.",
    ],
    topics: ["2. Die 10 Regeln der DGE", "1. Diabetes Präsentation"],
  },
  {
    slug: "fieber-dokumentation",
    title: "Fieberdokumentation üben",
    description:
      "Erstelle eine vollständige Fieberkurve und dokumentiere Pflegeinterventionen je Phase.",
    focus:
      "Du trainierst die korrekte Dokumentation von Fieberverläufen und Pflegemaßnahmen.",
    steps: [
      "Zeichne eine Fieberkurve mit realistischen Werten über 3 Tage.",
      "Ordne jeder Phase (Anstieg, Höhe, Abfall) die passenden Pflegeinterventionen zu.",
      "Dokumentiere Vitalzeichen, Wadenwickel-Anwendung und Flüssigkeitsbilanz.",
    ],
    topics: ["Fieber"],
  },
  {
    slug: "wundversorgung-simulation",
    title: "Verbandswechsel-Simulation",
    description:
      "Simuliere einen vollständigen aseptischen Verbandswechsel nach Non-Touch-Technik.",
    focus:
      "Du trainierst den sterilen Ablauf in der richtigen Reihenfolge.",
    steps: [
      "Bereite alle Materialien vor und lege sie in der richtigen Reihenfolge bereit.",
      "Führe den Verbandswechsel als Trockenübung durch (Handschuhe, Pinzette, Kompressen).",
      "Fülle anschließend einen Wunddokumentationsbogen vollständig aus.",
      "Lasse eine Lernpartner:in deine Technik beobachten und Feedback geben.",
    ],
    topics: ["04 Wunden & Wundversorgung", "04b Literatur Wunden und Drainagen"],
  },
]
