/**
 * Structured knowledge extracted from all PDFs in /pdf-uploads.
 * Used by the KI-Assistent chat and the KI-Quiz generator to provide
 * content-accurate, curriculum-aligned responses.
 */

export type KnowledgeEntry = {
  topic: string
  subtopic: string
  content: string
  keywords: string[]
  source: string
}

export const pdfKnowledge: KnowledgeEntry[] = [
  // ── Thrombose ──────────────────────────────────────────────
  {
    topic: "Thrombose",
    subtopic: "Definition",
    content:
      "Eine Thrombose ist ein Gefäßverschluss durch intravasale Blutgerinnung (Thrombus). Der Thrombus kann das Gefäß teilweise oder vollständig verschließen. Betroffen sind vor allem die tiefen Bein- und Beckenvenen.",
    keywords: ["Thrombose", "Thrombus", "Gefäßverschluss", "Beinvene"],
    source: "1. Definition Thrombose",
  },
  {
    topic: "Thrombose",
    subtopic: "Symptome",
    content:
      "Typische Symptome einer tiefen Beinvenenthrombose: einseitiges Schweregefühl, warme Extremität, Schwellung, Wadenschmerz (Homans-Zeichen), bläulich-rote Verfärbung der Haut und gespanntes Hautbild.",
    keywords: ["Symptome", "Schwellung", "Wadenschmerz", "Homans-Zeichen"],
    source: "1. Definition Thrombose",
  },
  {
    topic: "Thrombose",
    subtopic: "Sofortmaßnahmen",
    content:
      "Bei Verdacht auf Phlebothrombose: sofort den Arzt verständigen, absolute Bettruhe einhalten, Oberkörper hochlagern. Keine aktive Mobilisation ohne ärztliche Anordnung, da Emboliegefahr besteht.",
    keywords: ["Sofortmaßnahme", "Bettruhe", "Arzt", "Embolie"],
    source: "1. Definition Thrombose",
  },
  {
    topic: "Thrombose",
    subtopic: "Virchow-Trias",
    content:
      "Die Virchow-Trias beschreibt drei Hauptursachen für eine Thrombose: 1. Verlangsamte Blutströmung (z.B. durch Immobilität, Herzinsuffizienz), 2. Gefäßwandschaden (z.B. durch Verletzung, OP, Entzündung), 3. Erhöhte Gerinnungsneigung (z.B. durch Dehydratation, Medikamente, Gerinnungsstörungen).",
    keywords: ["Virchow-Trias", "Blutströmung", "Gefäßwand", "Gerinnung"],
    source: "2. Übersicht Virchow Trias",
  },
  {
    topic: "Thrombose",
    subtopic: "Risikofaktoren",
    content:
      "Risikofaktoren einer Thrombose: Immobilität (Bettlägerigkeit, Gipsverband), Operationen, Dehydratation, Übergewicht, Rauchen, hormonelle Verhütung, Schwangerschaft, höheres Lebensalter, Herzinsuffizienz, Varikosis, Tumorerkrankungen und angeborene Gerinnungsstörungen.",
    keywords: ["Risikofaktoren", "Immobilität", "Operation", "Dehydratation"],
    source: "3. Risikofaktoren einer Thrombose",
  },
  {
    topic: "Thrombose",
    subtopic: "Lungenembolie",
    content:
      "Eine Lungenembolie entsteht, wenn sich ein Thrombus (meist aus den tiefen Beinvenen) löst und über das venöse System in die Lungenarterien gelangt. Symptome: plötzliche Atemnot, Brustschmerz, Tachykardie, Angst, Zyanose. Eine Lungenembolie ist lebensbedrohlich. Sofortmaßnahmen: Notruf, Oberkörper hochlagern, Sauerstoffgabe, Vitalzeichen überwachen.",
    keywords: ["Lungenembolie", "Atemnot", "Brustschmerz", "Tachykardie"],
    source: "1a Lungenembolie",
  },
  {
    topic: "Thrombose",
    subtopic: "Venensystem der Beine",
    content:
      "Das Venensystem der Beine besteht aus tiefen und oberflächlichen Venen, die durch Perforansvenen verbunden sind. Die tiefen Beinvenen (V. femoralis, V. poplitea, V. tibialis) transportieren ca. 90 % des Blutes zum Herzen. Venenklappen verhindern den Rückfluss. Die Muskelpumpe (besonders Wadenmuskel) unterstützt den venösen Rückstrom.",
    keywords: ["Venensystem", "Venenklappen", "Muskelpumpe", "Perforansvenen"],
    source: "1b Venensystem der Beine",
  },
  {
    topic: "Thromboseprophylaxe",
    subtopic: "Ansatzpunkte und Ziele",
    content:
      "Ansatzpunkte der Thromboseprophylaxe orientieren sich an der Virchow-Trias: 1. Blutströmung beschleunigen (Mobilisation, Bewegungsübungen), 2. Gefäßwand schützen (schonende Lagerung, Vermeidung von Druckstellen), 3. Gerinnung regulieren (Flüssigkeitszufuhr, medikamentöse Prophylaxe). Ziele: Thromboseentstehung verhindern, Komplikationen wie Lungenembolie vermeiden.",
    keywords: ["Prophylaxe", "Mobilisation", "Flüssigkeit", "Antikoagulation"],
    source: "6. Ansatzpunkte & Ziele der Thromboseprophylaxe",
  },
  {
    topic: "Thromboseprophylaxe",
    subtopic: "Bewegungsübungen",
    content:
      "Bewegungsübungen zur Thromboseprophylaxe: aktive Fußbewegungen (Fußkreisen, Zehenziehen, Fußwippen), Beine im Bett bewegen, Kniebeugung. Diese aktivieren die Muskelpumpe und fördern den venösen Rückfluss. Mehrmals täglich für 1–2 Minuten durchführen.",
    keywords: ["Bewegungsübungen", "Fußbewegungen", "Muskelpumpe"],
    source: "Text - Bewegungsübungen",
  },
  {
    topic: "Thromboseprophylaxe",
    subtopic: "Atemübungen",
    content:
      "Tiefe Atemübungen unterstützen den venösen Rückfluss durch den Sogeffekt im Brustkorb. Technik: tiefes Einatmen durch die Nase, Atempause, langsames Ausatmen durch den Mund. 3–5 tiefe Atemzüge, mehrmals täglich. Fördert die Lungenbelüftung und wirkt unterstützend gegen Thrombose.",
    keywords: ["Atemübungen", "Sogeffekt", "Lungenbelüftung"],
    source: "Text - Atemübungen",
  },
  {
    topic: "Thromboseprophylaxe",
    subtopic: "Ausstreichen der Beinvenen",
    content:
      "Technik: Mit beiden Händen das Bein von distal (Fuß) nach proximal (Oberschenkel) gleichmäßig ausstreichen. Ziel: venösen Rückfluss fördern, Blutstauung verhindern. Kontraindikation: bestehende Thrombose, frische OP-Wunden am Bein. Immer herzaufwärts streichen.",
    keywords: ["Ausstreichen", "Beinvenen", "distal", "proximal"],
    source: "Text - Ausstreichen der Beinvenen",
  },
  {
    topic: "Thromboseprophylaxe",
    subtopic: "Hochlagerung",
    content:
      "Beine werden leicht erhöht (ca. 15–20°) gelagert, um den venösen Rückfluss zu erleichtern. Die Fersen müssen frei liegen (Dekubitusprophylaxe). Kontraindiziert bei arteriellen Durchblutungsstörungen. Lagerungshilfen (Kissen, Schaumstoffkeile) nutzen.",
    keywords: ["Hochlagerung", "Fersen frei", "Dekubitus"],
    source: "Text - Hochlagerung der Beine",
  },
  {
    topic: "Thromboseprophylaxe",
    subtopic: "Kompressionsverband",
    content:
      "Der Kompressionsverband wird von distal nach proximal gewickelt. Ziel: venösen Rückfluss verbessern, Ödeme verhindern. Druckverlauf: höchster Druck am Knöchel, abnehmend nach oben. Kontrolle: Zehen sichtbar lassen, Durchblutung und Sensibilität prüfen, Faltenbildung vermeiden.",
    keywords: ["Kompressionsverband", "distal", "proximal", "Druckverlauf"],
    source: "Text - Kompressionsverband",
  },
  {
    topic: "Thromboseprophylaxe",
    subtopic: "Thromboseprophylaxestrumpf",
    content:
      "Der medizinische Thromboseprophylaxestrumpf (MTPS) wird morgens vor dem Aufstehen angelegt. Korrekte Größe durch Messen von Wadenumfang und Beinlänge. Strumpf faltenlos anziehen, Zehen und Ferse richtig positionieren. Mindestens 2× täglich Haut- und Durchblutungskontrolle.",
    keywords: ["Prophylaxestrumpf", "MTPS", "Wadenumfang", "Hautkontrolle"],
    source: "Text - Medizinischer Thromboseprophylaxestrumpf",
  },
  // ── Wunden ─────────────────────────────────────────────────
  {
    topic: "Wunden",
    subtopic: "Wundarten",
    content:
      "Wundarten werden nach Ursache unterschieden: 1. Mechanische Wunden (Schnitt-, Stich-, Quetsch-, Schürf-, Risswunden), 2. Chemische Wunden (Verätzungen durch Säuren oder Laugen), 3. Thermische Wunden (Verbrennungen durch Hitze, Erfrierungen durch Kälte), 4. Strahlenbedingte Wunden (UV, Röntgen, radioaktive Strahlung).",
    keywords: ["Wundarten", "mechanisch", "chemisch", "thermisch", "Strahlen"],
    source: "04 Wunden & Wundversorgung",
  },
  {
    topic: "Wunden",
    subtopic: "Aseptisch vs. septisch",
    content:
      "Aseptische Wunden sind keimfrei (z.B. OP-Wunden unter sterilen Bedingungen). Septische Wunden sind mit Keimen besiedelt und zeigen Infektionszeichen: Rötung (Rubor), Wärme (Calor), Schwellung (Tumor), Schmerz (Dolor), eitriges Exsudat, ggf. Funktionseinschränkung (Functio laesa).",
    keywords: ["aseptisch", "septisch", "Infektionszeichen", "keimfrei"],
    source: "04 Wunden & Wundversorgung",
  },
  {
    topic: "Wunden",
    subtopic: "Wundheilungsphasen",
    content:
      "Die Wundheilung verläuft in drei Phasen: 1. Exsudationsphase (Reinigungsphase, 0–3 Tage): Blutstillung, Entzündungsreaktion, Wundreinigung. 2. Proliferationsphase (Granulationsphase, 1–14 Tage): Bildung von neuem Gewebe (Granulationsgewebe), Wundkontraktion. 3. Regenerationsphase (Epithelisierung, ab Tag 4, überlappend): Narbenbildung, Gewebestabilisierung.",
    keywords: ["Exsudation", "Proliferation", "Regeneration", "Granulation"],
    source: "04a AB Wundheilung",
  },
  {
    topic: "Wunden",
    subtopic: "Primäre und sekundäre Wundheilung",
    content:
      "Primäre Wundheilung: Wundränder liegen dicht aneinander, komplikationslose Heilung mit kleiner Narbe (z.B. chirurgisch vernähte Wunde). Sekundäre Wundheilung: Wundränder klaffen auseinander, Heilung über Granulationsgewebe, langsamer, größere Narbe. Tritt bei verunreinigten oder infizierten Wunden auf.",
    keywords: ["primäre Wundheilung", "sekundäre Wundheilung", "Narbe"],
    source: "04 Wunden & Wundversorgung",
  },
  {
    topic: "Wunden",
    subtopic: "Wunddokumentation",
    content:
      "Pflichtangaben der Wunddokumentation: Datum und Uhrzeit, Wundgröße (Länge × Breite × Tiefe in cm), Exsudatmenge und -art, Geruch, Schmerzen (VAS 0–10), Wundrand und Wundumgebung, verwendetes Verbandmaterial, Fotodokumentation. Dokumentation bei jedem Verbandswechsel.",
    keywords: ["Wunddokumentation", "Exsudat", "Schmerzskala", "Wundrand"],
    source: "04 Wunden & Wundversorgung",
  },
  {
    topic: "Wunden",
    subtopic: "Non-Touch-Technik",
    content:
      "Bei der Non-Touch-Technik wird die sterile Wundfläche und steriles Material niemals mit den Händen berührt. Es werden sterile Instrumente (Pinzetten, Klemmen) verwendet. Ablauf: Händedesinfektion, alten Verband entfernen, Wunde inspizieren, mit steriler Lösung reinigen, neuen Verband mit steriler Pinzette auflegen. Kontaminationsrisiko wird minimiert.",
    keywords: ["Non-Touch", "steril", "Pinzette", "Kontamination"],
    source: "04b Literatur Wunden und Drainagen",
  },
  {
    topic: "Wunden",
    subtopic: "Drainagen",
    content:
      "Drainagen leiten Wundsekret, Blut oder Eiter aus Körperhöhlen oder Wunden ab. Arten: Redon-Drainage (geschlossenes Vakuumsystem), Robinson-Drainage (offene Drainage), T-Drainage (Gallenwege). Pflege: Fördermenge dokumentieren, Drainagesystem auf Funktion prüfen, Einstichstelle beobachten, aseptisch arbeiten.",
    keywords: ["Drainage", "Redon", "Wundsekret", "Vakuum"],
    source: "04b Literatur Wunden und Drainagen",
  },
  // ── Diabetes ───────────────────────────────────────────────
  {
    topic: "Diabetes",
    subtopic: "Definition und Typen",
    content:
      "Diabetes mellitus ist eine chronische Stoffwechselerkrankung mit erhöhten Blutzuckerwerten. Typ 1: Autoimmunzerstörung der Betazellen, absoluter Insulinmangel, meist Jugendliche. Typ 2: Insulinresistenz und relative Insulinsekretionsstörung, häufig bei Übergewicht und höherem Alter. Gestationsdiabetes: Schwangerschaftsdiabetes, erhöhtes Risiko für spätere Typ-2-Entwicklung.",
    keywords: ["Diabetes", "Typ 1", "Typ 2", "Insulinresistenz"],
    source: "1. Diabetes Präsentation",
  },
  {
    topic: "Diabetes",
    subtopic: "Diagnostik und Werte",
    content:
      "Diagnostische Werte: Nüchtern-Blutzucker normal 80–100 mg/dl, pathologisch ≥ 126 mg/dl. HbA1c ≥ 6,5% gilt als Diagnosegrenze für Diabetes mellitus (Langzeitwert über 8–12 Wochen). Oraler Glukosetoleranztest (oGTT): nach 2 Stunden ≥ 200 mg/dl = Diabetes. Postprandial normal < 140 mg/dl.",
    keywords: ["HbA1c", "Nüchtern-BZ", "oGTT", "Diagnosegrenze"],
    source: "1. Diabetes Präsentation",
  },
  {
    topic: "Diabetes",
    subtopic: "Insulinwirkung",
    content:
      "Insulin wird von den Betazellen der Langerhans-Inseln in der Bauchspeicheldrüse produziert. Wirkungen: Glukose wird in Muskel-, Fett- und Leberzellen eingeschleust und dort als Glykogen gespeichert. Insulin senkt den Blutzuckerspiegel. Gegenspieler ist Glukagon, das Glykogen abbaut und den BZ erhöht.",
    keywords: ["Insulin", "Betazellen", "Glykogen", "Glukagon"],
    source: "1. Diabetes Präsentation",
  },
  {
    topic: "Diabetes",
    subtopic: "Hypoglykämie",
    content:
      "Hypoglykämie: Blutzucker unter 50 mg/dl. Ursachen: zu viel Insulin, zu wenig Nahrung, ungewohnte Bewegung. Symptome: Zittern, Schwitzen, Heißhunger, Unruhe, Bewusstseinsstörung. Sofortmaßnahmen: Traubenzucker oder Glukose geben, BZ messen, Arzt informieren. Bei Bewusstlosigkeit: stabile Seitenlage, nichts oral geben, Notruf.",
    keywords: ["Hypoglykämie", "Unterzuckerung", "Traubenzucker", "Bewusstlosigkeit"],
    source: "1. Diabetes Präsentation",
  },
  {
    topic: "Diabetes",
    subtopic: "Hyperglykämie",
    content:
      "Hyperglykämie: dauerhaft erhöhter Blutzucker über 180 mg/dl (nüchtern > 126 mg/dl). Symptome: starker Durst (Polydipsie), häufiges Wasserlassen (Polyurie), Müdigkeit, Gewichtsverlust, trockene Haut, Sehstörungen. Gefahr: diabetisches Koma (Ketoazidose bei Typ 1, hyperosmolares Koma bei Typ 2). BZ messen, Arzt informieren, Flüssigkeit anbieten.",
    keywords: ["Hyperglykämie", "Polydipsie", "Polyurie", "Ketoazidose"],
    source: "1. Diabetes Präsentation",
  },
  {
    topic: "Diabetes",
    subtopic: "Insulin-PEN",
    content:
      "Insulin-PEN Schrittfolge: 1. Hände waschen und desinfizieren, 2. Nadel aufsetzen und Funktionskontrolle (2 IE in die Luft), 3. Dosis einstellen, 4. Injektionsstelle wählen und desinfizieren (Bauch, Oberschenkel, Oberarm – Rotation!), 5. Hautfalte bilden und im 90°-Winkel einstechen, 6. Dosis injizieren und 10 Sekunden warten, 7. Nadel entfernen und Einstichstelle kurz drücken. Nadel nach Gebrauch entsorgen (Abwurfbehälter).",
    keywords: ["Insulin-PEN", "Injektion", "Hautfalte", "Rotation"],
    source: "5. Insulinspritzen mit dem PEN",
  },
  {
    topic: "Diabetes",
    subtopic: "Pflege bei Diabetes Typ 2",
    content:
      "Pflegerische Schwerpunkte: BZ-Kontrolle (nüchtern und postprandial), Ernährungsberatung (Kohlenhydrate bewusst wählen), Fußpflege und Hautinspektion (Neuropathie-Prophylaxe), Medikamentenmanagement, Patientenedukation, Bewegungsförderung. Dokumentation: BZ-Kurve, Insulingabe, Auffälligkeiten, Ernährungsprotokolle.",
    keywords: ["Pflege", "BZ-Kontrolle", "Fußpflege", "Ernährungsberatung"],
    source: "8 Pflege bei Diabetes mellitus Typ 2",
  },
  {
    topic: "Diabetes",
    subtopic: "Spätfolgen",
    content:
      "Typische Spätfolgen bei Diabetes mellitus: Diabetische Retinopathie (Augenschäden bis Erblindung), Diabetische Nephropathie (Nierenschäden), Diabetische Neuropathie (Nervenschäden, besonders Füße), Diabetisches Fußsyndrom (Ulzera, Amputationsgefahr), Makroangiopathie (Herzinfarkt, Schlaganfall), erhöhtes Infektionsrisiko.",
    keywords: ["Spätfolgen", "Retinopathie", "Nephropathie", "Neuropathie"],
    source: "3. AB Diabetes mellitus",
  },
  // ── Ernährung / DGE ────────────────────────────────────────
  {
    topic: "Ernährung",
    subtopic: "DGE 10 Regeln",
    content:
      "Die 10 Regeln der Deutschen Gesellschaft für Ernährung (DGE): 1. Lebensmittelvielfalt genießen, 2. Gemüse und Obst – nimm 5 am Tag, 3. Vollkorn wählen, 4. Mit tierischen Lebensmitteln die Auswahl ergänzen, 5. Gesundheitsfördernde Fette nutzen, 6. Zucker und Salz einsparen, 7. Am besten Wasser trinken (1,5 Liter/Tag), 8. Schonend zubereiten, 9. Achtsam essen und genießen, 10. Auf Gewicht achten und in Bewegung bleiben.",
    keywords: ["DGE", "10 Regeln", "Ernährung", "Vollkorn", "5 am Tag"],
    source: "2.Die 10-Regeln-der-DGE",
  },
  {
    topic: "Ernährung",
    subtopic: "Fleisch und Eiweiß",
    content:
      "Die DGE empfiehlt maximal 300–600 g Fleisch und Wurstwaren pro Woche. Pflanzliche Eiweißquellen (Hülsenfrüchte, Nüsse, Tofu) sind zu bevorzugen. Fisch: 1–2 Portionen pro Woche (fettreich wie Lachs für Omega-3-Fettsäuren). Milchprodukte: täglich, fettarme Varianten bevorzugen.",
    keywords: ["Fleisch", "Eiweiß", "Hülsenfrüchte", "Omega-3"],
    source: "2.Die 10-Regeln-der-DGE",
  },
  {
    topic: "Ernährung",
    subtopic: "Flüssigkeit",
    content:
      "Empfohlene Trinkmenge: ca. 1,5 Liter pro Tag, vorzugsweise Wasser oder ungesüßte Getränke. Bei Fieber, Hitze oder körperlicher Anstrengung mehr trinken. Zucker- und alkoholhaltige Getränke meiden. Trinkprotokolle bei gefährdeten Patient:innen führen. Dehydratation erhöht Thromboserisiko.",
    keywords: ["Flüssigkeit", "Trinkmenge", "Dehydratation", "Wasser"],
    source: "2.Die 10-Regeln-der-DGE",
  },
  // ── Fieber ─────────────────────────────────────────────────
  {
    topic: "Fieber",
    subtopic: "Definition und Temperaturbereiche",
    content:
      "Fieber ist eine Erhöhung der Körpertemperatur über 38 °C (rektal gemessen). Temperaturbereiche: Normal 36,0–37,0 °C, Subfebril 37,1–37,9 °C, Leichtes Fieber 38,0–38,5 °C, Mäßiges Fieber 38,6–39,0 °C, Hohes Fieber 39,1–39,9 °C, Sehr hohes Fieber ≥ 40,0 °C. Messmethoden: rektal (genaueste), oral, axillär, Ohr (Infrarot).",
    keywords: ["Fieber", "Temperatur", "subfebril", "rektal"],
    source: "Fieber",
  },
  {
    topic: "Fieber",
    subtopic: "Fieberphasen",
    content:
      "Drei Phasen des Fieberverlaufs: 1. Fieberanstieg: Zentralisierung, Schüttelfrost, Frieren, kalte Extremitäten – Pflegeintervention: warm halten, warme Getränke, Vitalzeichenkontrolle. 2. Fieberhöhe: Haut heiß und trocken, Tachykardie, Unruhe – Pflegeintervention: Ruhe, Vitalzeichen kontrollieren, Flüssigkeit anbieten. 3. Fieberabfall: starkes Schwitzen, Kreislaufschwäche – Pflegeintervention: Wäsche wechseln, Flüssigkeit ausgleichen, Kreislauf beobachten.",
    keywords: ["Fieberphasen", "Schüttelfrost", "Fieberanstieg", "Fieberabfall"],
    source: "Fieber",
  },
  {
    topic: "Fieber",
    subtopic: "Maßnahmen",
    content:
      "Pflegerische Maßnahmen bei Fieber: Vitalzeichen mindestens 2× täglich kontrollieren (bei hohem Fieber häufiger). Wadenwickel nur bei warmen Extremitäten und Temperaturen über 39 °C anwenden (20 Minuten, 3× wiederholen). Kühle Waschungen. Flüssigkeitszufuhr erhöhen (pro Grad über 37 °C ca. 500 ml mehr). Leichte Kleidung und Bettwäsche. Medikamentöse Fiebersenkung (Paracetamol, Ibuprofen) nur nach ärztlicher Anordnung.",
    keywords: ["Wadenwickel", "Vitalzeichen", "Paracetamol", "Flüssigkeit"],
    source: "Fieber",
  },
  {
    topic: "Fieber",
    subtopic: "Fieberarten",
    content:
      "Fieberarten nach Verlauf: Kontinuierliches Fieber (gleichbleibend hoch, Schwankung < 1 °C), Remittierendes Fieber (Schwankung > 1 °C, aber nicht unter 37 °C), Intermittierendes Fieber (täglicher Wechsel zwischen Fieber und Normaltemperatur), Rekurrierendes Fieber (fieberfreie Intervalle über Tage), Undulierendes Fieber (wellenförmiger Verlauf).",
    keywords: ["Fieberarten", "kontinuierlich", "remittierend", "intermittierend"],
    source: "Fieber",
  },
  // ── Fallbeispiel ───────────────────────────────────────────
  {
    topic: "Fallbeispiel",
    subtopic: "Herr Winterhaus",
    content:
      "Herr Winterhaus ist ein 72-jähriger Patient mit Diabetes mellitus Typ 2, postoperativer Wunde am rechten Unterschenkel und eingeschränkter Mobilität. Pflegeprobleme: erhöhtes Thromboserisiko durch Immobilität, Wundversorgung und BZ-Management erforderlich, Fieber als Infektionszeichen möglich. Pflegeziele: BZ-Einstellung im Zielbereich, Wundheilung ohne Komplikation, Thromboseprophylaxe durchführen, Mobilisation fördern. Maßnahmen: regelmäßige BZ-Kontrolle, aseptischer Verbandswechsel, Bewegungsübungen, Kompression, Ernährung anpassen.",
    keywords: ["Fallbeispiel", "Winterhaus", "Pflegeplanung", "Mobilisation"],
    source: "LS 4C Herr Winterhaus (Fallbeispiel)",
  },
  // ── Schmerzmanagement ──────────────────────────────────────
  {
    topic: "Schmerzmanagement",
    subtopic: "Definition und Grundlagen",
    content:
      "Schmerz ist ein unangenehmes sensorisches und emotionales Erlebnis, das mit tatsächlicher oder potenzieller Gewebeschädigung einhergeht. Schmerz ist immer subjektiv – nur der Betroffene kann ihn bewerten. Ziel des Schmerzmanagements ist die bestmögliche Lebensqualität, die Vorbeugung einer Chronifizierung und das rechtzeitige Erkennen und Behandeln von Schmerzen. Das Bio-Psycho-Soziale Modell beschreibt die Multidimensionalität des Schmerzes: physisch, psychisch, sozial und spirituell.",
    keywords: ["Schmerzmanagement", "Schmerz", "Definition", "Bio-Psycho-Sozial", "Lebensqualität", "subjektiv"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Schmerzarten",
    content:
      "Akuter Schmerz: Plötzlich auftretend, Warnsignal des Körpers, meist gut behandelbar, verschwindet nach Beseitigung der Ursache. Chronischer Schmerz: Über Wochen bis Monate anhaltend, verliert Warnfunktion, wird eigenständige Erkrankung, beeinträchtigt den Alltag deutlich. Nozizeptiver Schmerz: Entsteht durch Reizung von Schmerzrezeptoren (z.B. Verletzung, Entzündung, Tumor), typisch dumpf, pochend, stechend. Neuropathischer Schmerz: Folge von Nervenschädigung (z.B. diabetische Polyneuropathie), brennend, elektrisierend, einschießend. Noziplastischer Schmerz: Veränderte Schmerzverarbeitung im ZNS ohne nachweisbare Gewebeschädigung.",
    keywords: ["Schmerzarten", "akut", "chronisch", "nozizeptiv", "neuropathisch", "noziplastisch", "Nervenschmerz"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Schmerzassessment – Numerische Rangskala (NRS)",
    content:
      "Die Numerische Rangskala (NRS) ist das am häufigsten verwendete Instrument zur Schmerzeinschätzung. Der Patient schätzt seinen Schmerz auf einer Skala von 0 (kein Schmerz) bis 10 (stärkster vorstellbarer Schmerz) ein. Einfach und schnell durchführbar, besonders geeignet für verbal-kompetente Patienten. Erhebung bei Aufnahme, regelmäßig im Verlauf und nach Interventionen.",
    keywords: ["NRS", "Numerische Rangskala", "Schmerzskala", "Schmerzeinschätzung", "Assessment"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Schmerzassessment – Weitere Skalen",
    content:
      "VAS (Visuelle Analogskala): Patient markiert Schmerzintensität auf 10 cm langer Linie. Gut zur Verlaufskontrolle, erfordert kognitive Fähigkeiten. VRS (Verbale Rangskala): Auswahl verbaler Kategorien (kein, leicht, mäßig, stark, sehr stark, unerträglich). Intuitiv, aber erfasst kleine Veränderungen weniger präzise. Wong-Baker Faces Pain Scale (Smiley-Skala): Gesichter-Skala von lachend bis weinend, geeignet für Kinder und Personen mit Sprachbarrieren. BESD-Skala (Beurteilung von Schmerzen bei Demenz): Fremdeinschätzung durch Beobachtung von Atmung, Lautäußerung, Mimik, Körpersprache und Reaktion auf Trost.",
    keywords: ["VAS", "VRS", "Wong-Baker", "Smiley-Skala", "BESD", "Demenz", "Schmerzskala", "Fremdeinschätzung"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Schmerzanamnese und Dokumentation",
    content:
      "Die Schmerzanamnese umfasst: Lokalisation (Wo genau?), Intensität (NRS 0-10), Qualität (stechend, dumpf, brennend), Zeitverlauf (wann, wie oft, wie lange), Auslöser und Verstärker, Linderungsfaktoren, bisherige Therapie und deren Wirkung, Auswirkungen auf Alltagsaktivitäten und Lebensqualität. Ein Schmerztagebuch ist sinnvoll für die Verlaufskontrolle. Die Dokumentation muss Schmerzstärke, Maßnahmen, Wirksamkeit und Nebenwirkungen lückenlos erfassen.",
    keywords: ["Schmerzanamnese", "Dokumentation", "Schmerztagebuch", "Lokalisation", "Intensität", "Qualität"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "WHO-Stufenschema – Übersicht",
    content:
      "Das WHO-Stufenschema ist eine Leitlinie zur stufenweisen medikamentösen Schmerztherapie. Stufe 1: Nicht-Opioid-Analgetika (z.B. Ibuprofen, Diclofenac, Paracetamol, Metamizol) ± Adjuvantien. Stufe 2: Schwache Opioide (z.B. Tramadol, Tilidin, Codein) + Nicht-Opioide ± Adjuvantien. Stufe 3: Starke Opioide (z.B. Morphin, Oxycodon, Fentanyl, Hydromorphon) + Nicht-Opioide ± Adjuvantien. Adjuvantien sind unterstützende Medikamente wie Antidepressiva, Antikonvulsiva oder Glukokortikoide. Stufensprünge sind möglich – es muss nicht mit Stufe 1 begonnen werden.",
    keywords: ["WHO-Stufenschema", "Stufe", "Opioid", "Nicht-Opioid", "Adjuvantien", "Schmerztherapie", "medikamentös"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Nicht-Opioid-Analgetika (WHO Stufe 1)",
    content:
      "NSAR (Nichtsteroidale Antirheumatika): Ibuprofen, Diclofenac, Naproxen, ASS – wirken analgetisch, antiphlogistisch und antipyretisch. Nebenwirkungen: Magenschleimhautschädigung (Ulcus, Blutungen), Nierenfunktionsstörung, kardiovaskuläres Risiko, allergische Reaktionen. Paracetamol: analgetisch und antipyretisch, kein antiphlogistischer Effekt, lebertoxisch in Überdosis. Metamizol: stark analgetisch und spasmolytisch, Risiko der Agranulozytose. Wichtig: Kombination mit Magenschutz (PPI) bei NSAR oft erforderlich.",
    keywords: ["NSAR", "Ibuprofen", "Diclofenac", "Paracetamol", "Metamizol", "Nicht-Opioid", "Stufe 1", "Nebenwirkungen"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Opioid-Analgetika (WHO Stufe 2 und 3)",
    content:
      "Schwache Opioide (Stufe 2): Tramadol, Tilidin (+ Naloxon), Codein, Dihydrocodein. Starke Opioide (Stufe 3): Morphin (Goldstandard), Oxycodon, Hydromorphon, Fentanyl (auch als Pflaster), Buprenorphin. Nebenwirkungen aller Opioide: Übelkeit und Erbrechen (v.a. initial), Obstipation (häufigste Dauernebenw., Laxanzien prophylaktisch), Sedierung und Müdigkeit, Atemdepression (dosisabhängig), Juckreiz, Harnverhalt, Verwirrtheit. Toleranzentwicklung bei Langzeittherapie möglich. Bei Tumorpatienten ist die Suchtgefahr untergeordnet.",
    keywords: ["Opioide", "Morphin", "Oxycodon", "Fentanyl", "Tramadol", "Tilidin", "Obstipation", "Atemdepression", "Stufe 2", "Stufe 3"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Nicht-medikamentöse Maßnahmen",
    content:
      "Physikalische Maßnahmen: Kälteanwendung (Eispackungen, Kühlpads) bei akuten Entzündungen und Schwellungen. Wärmeanwendung (Wärmflaschen, Kirschkernkissen, warme Wickel) bei chronischen Muskelverspannungen. Bewegungstherapie und Physiotherapie zur Schmerzlinderung und Funktionserhalt. Massage zur Entspannung der Muskulatur. Psychologische Verfahren: Progressive Muskelrelaxation nach Jacobson, Atemübungen, Ablenkung, Musiktherapie, Aromatherapie, Gespräche. Lagerung: Schmerzarme Positionierung, Weichlagerung, Schienenlagerung. TENS (Transkutane Elektrische Nervenstimulation): Elektrische Impulse zur Schmerzlinderung.",
    keywords: ["nicht-medikamentös", "Kälte", "Wärme", "Massage", "Entspannung", "TENS", "Lagerung", "Physiotherapie", "Bewegungstherapie"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Pflegerische Aufgaben und Interventionen",
    content:
      "Systematische Schmerzerfassung bei Aufnahme und regelmäßig im Verlauf mit geeigneten Assessment-Instrumenten. Ernstnahme der subjektiven Schmerzangaben – der Patient ist der Experte für seinen Schmerz. Umsetzung und Überwachung der ärztlich verordneten Schmerztherapie. Beobachtung und Dokumentation von Schmerzintensität, Wirkung und Nebenwirkungen. Prophylaxe von Nebenwirkungen (z.B. Obstipationsprophylaxe bei Opioiden). Motivation zur regelmäßigen Medikamenteneinnahme nach der Uhr statt nach Bedarf. Aufklärung und Beratung: Ängste vor Abhängigkeit nehmen, Selbstmanagement fördern. Information über nicht-medikamentöse Maßnahmen. Zusammenarbeit im interdisziplinären Team (Arzt, Physiotherapie, Psychologie).",
    keywords: ["Pflege", "Assessment", "Beobachtung", "Dokumentation", "Beratung", "interdisziplinär", "Schmerzerfassung"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Expertenstandard Schmerzmanagement (DNQP)",
    content:
      "Der Expertenstandard Schmerzmanagement in der Pflege des DNQP (Deutsches Netzwerk für Qualitätsentwicklung in der Pflege) bildet den Rahmen für professionelles Schmerzmanagement. Er umfasst sechs Standardebenen: 1) Schmerzerhebung bei allen Patienten, 2) Qualifizierte Schmerzeinschätzung mit validierten Instrumenten, 3) Individuelle Therapieplanung, 4) Durchführung medikamentöser und nicht-medikamentöser Maßnahmen, 5) Evaluation der Wirksamkeit (Reassessment), 6) Beratung und Schulung von Patienten und Angehörigen. Aktualisierung 2020: Zusammenführung der Standards für akuten und chronischen Schmerz.",
    keywords: ["DNQP", "Expertenstandard", "Qualität", "Standardebenen", "Evaluation", "Reassessment", "Schulung"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Besondere Patientengruppen",
    content:
      "Kinder: Altersgerechte Skalen verwenden (Wong-Baker Gesichterskala). Nonverbale Schmerzzeichen beobachten (Weinen, Schonhaltung, Rückzug). Eltern als wichtige Informationsquelle einbeziehen. Geriatrische Patienten: Häufig Multimorbidität und Polypharmazie beachten. Wechselwirkungen und erhöhte Empfindlichkeit gegenüber Opioiden berücksichtigen. Menschen mit Demenz: BESD-Skala (Beurteilung von Schmerzen bei Demenz) nutzen. Beobachtung von Verhaltensänderungen: Unruhe, Abwehr, veränderter Gesichtsausdruck, Lautäußerungen. Kognitive Einschränkungen: Einfache Sprache, Bilder und Gesichterskalen verwenden. Häufigere Assessments durchführen.",
    keywords: ["Kinder", "Demenz", "BESD", "Geriatrie", "Polypharmazie", "nonverbal", "Verhaltensbeobachtung"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Schmerzchronifizierung und Prävention",
    content:
      "Chronifizierung bedeutet, dass akuter Schmerz in chronischen Schmerz übergeht. Risikofaktoren: unzureichende Akutschmerztherapie, psychosoziale Belastungen, Katastrophisierung, Angst-Vermeidungsverhalten, Depression. Prävention: Frühzeitige und konsequente Schmerztherapie bereits im Akutstadium. Multimodale Schmerztherapie bei Risikopatienten (Kombination aus medikamentöser Therapie, Physiotherapie und psychologischer Betreuung). Aufklärung über Schmerzgedächtnis: Das Nervensystem kann sich Schmerzreize merken und auch ohne aktuellen Reiz Schmerz signalisieren.",
    keywords: ["Chronifizierung", "Prävention", "Schmerzgedächtnis", "multimodal", "Risikofaktoren", "Angst-Vermeidung"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Medikamentengabe – Pflegerische Grundsätze",
    content:
      "6-R-Regel: Richtiger Patient, richtiges Medikament, richtige Dosis, richtiger Zeitpunkt, richtige Applikationsform, richtige Dokumentation. Applikationsformen: oral (Tabletten, Tropfen), sublingual, rektal, transdermal (Schmerzpflaster), subkutan, intravenös, intramuskulär. Wichtig bei Schmerzpflastern (z.B. Fentanyl-Pflaster): Wechselintervall beachten (meist alle 72 Stunden), Applikationsstelle wechseln, nicht zerschneiden, bei Fieber verstärkte Wirkstofffreisetzung möglich. BtM-Vorschriften bei starken Opioiden beachten: gesonderte Aufbewahrung, lückenlose Dokumentation, Vier-Augen-Prinzip.",
    keywords: ["6-R-Regel", "Medikamentengabe", "Applikation", "Schmerzpflaster", "BtM", "Fentanyl-Pflaster", "transdermal"],
    source: "PAP LP Schmerzmanagement",
  },
  {
    topic: "Schmerzmanagement",
    subtopic: "Interprofessionelle Zusammenarbeit",
    content:
      "Effektives Schmerzmanagement erfordert die Zusammenarbeit verschiedener Berufsgruppen: Pflegefachkräfte (Schmerzerfassung, Medikamentengabe, Beobachtung, Beratung), Ärzte (Diagnostik, Therapieverordnung, Anpassung), Physiotherapeuten (Bewegungstherapie, Mobilisation), Psychologen (Schmerzverarbeitung, Entspannungsverfahren), Sozialarbeiter (psychosoziale Unterstützung), Apotheker (Medikamentenberatung, Wechselwirkungen). Schmerzkonferenzen und -visiten als strukturierte Besprechung des Therapieverlaufs. Die Pflegefachkraft hat eine koordinierende Rolle: Sie ist 24 Stunden am Patienten und erkennt Veränderungen als Erste.",
    keywords: ["interprofessionell", "Zusammenarbeit", "Schmerzkonferenz", "Physiotherapie", "Psychologe", "Team"],
    source: "PAP LP Schmerzmanagement",
  },
]

/**
 * Searches the knowledge base for entries matching a query string.
 * Returns matching entries sorted by relevance (keyword match count).
 */
export function searchKnowledge(query: string): KnowledgeEntry[] {
  const terms = query
    .toLowerCase()
    .split(/[\s\-–—]+/)
    .filter((t) => t.length > 2)

  if (terms.length === 0) return pdfKnowledge.slice(0, 5)

  const scored = pdfKnowledge.map((entry) => {
    const haystack = [
      entry.topic,
      entry.subtopic,
      entry.content,
      ...entry.keywords,
    ]
      .join(" ")
      .toLowerCase()

    let score = 0
    for (const term of terms) {
      if (haystack.includes(term)) score++
    }
    return { entry, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.entry)
}

/**
 * Returns all unique topics from the knowledge base.
 */
export function getTopics(): string[] {
  return Array.from(new Set(pdfKnowledge.map((e) => e.topic)))
}

/**
 * Returns all entries for a specific topic.
 */
export function getEntriesByTopic(topic: string): KnowledgeEntry[] {
  return pdfKnowledge.filter((e) => e.topic === topic)
}
