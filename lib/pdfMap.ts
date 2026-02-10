/**
 * Maps display names used in the learning platform to actual PDF filenames
 * in the /pdf-uploads directory.
 */
export const pdfMap: Record<string, string> = {
  "01a Thromboseprophylaxe - Pflegeassistenz Heute":
    "01a Thromboseprophylaxe - Pfegeassistenz Heute.pdf",
  "01b AB - Thromboseprophylaxe":
    "01b AB -Thromboseprophylaxe-1.pdf",
  "01c AB Virchow-Trias":
    "01c AB Virchow-Trias-1.pdf",
  "04 Wunden & Wundversorgung":
    "04 Wunden & Wundversorgung-1.pdf",
  "04a AB Wundheilung":
    "04a AB Wundheilung.pdf",
  "04b Literatur Wunden und Drainagen":
    "04b Literatur Wunden und Drainagen.pdf",
  "1. Definition Thrombose":
    "1. Definition Thrombose-1.pdf",
  "1. Diabetes Präsentation":
    "1. Diabetes Präsentation.pdf-1.pdf",
  "1a Lungenembolie":
    "1a Lungenembolie-1.pdf",
  "1b Venensystem der Beine":
    "1b Venensystem der Beine-1.pdf",
  "2. Übersicht Virchow-Trias":
    "2. Übersicht Virchow Trias.pdf",
  "2. Übersicht Virchow Trias":
    "2. Übersicht Virchow Trias.pdf",
  "2. Die 10 Regeln der DGE":
    "2.Die 10-Regeln-der-DGE.pdf",
  "2.Die 10-Regeln-der-DGE":
    "2.Die 10-Regeln-der-DGE.pdf",
  "3. AB Diabetes mellitus":
    "3. AB Diabetes mellitus-1.pdf",
  "3. Risikofaktoren einer Thrombose":
    "3. Risikofaktoren einer Thrombose-1.pdf",
  "4. Zuordnung der Virchow-Trias":
    "4. Zuordnung der  Virchow-1.pdf",
  "5. Insulinspritzen mit dem PEN":
    "5. Insulinspritzen mit dem PEN.pdf",
  "6. AB Diabetes mellitus Typ 2":
    "6. AB Diabetes mellitus Typ 2.pdf",
  "6. Ansatzpunkte & Ziele der Thromboseprophylaxe":
    "6. Ansatzpunkte und Ziele der Thromboseprophylaxe.pdf",
  "7. Lösung AB Diabetes mellitus Typ 2":
    "7. Lösung AB Diabetes mellitus Typ 2.pdf",
  "8 Pflege bei Diabetes mellitus Typ 2":
    "8 Pflege bei Diabetes mellitus Typ 2.pdf",
  "Fieber":
    "Fieber.pdf",
  "LS 4C Herr Winterhaus (Fallbeispiel)":
    "LS 4C Herr Winterhaus.pdf",
  "Text - Atemübungen":
    "Text - Atemübungen.pdf",
  "Text - Ausstreichen der Beinvenen":
    "Text - Ausstreichen der Beinvenen.pdf",
  "Text - Bewegungsübungen":
    "Text - Bewegungsübungen.pdf",
  "Text - Hochlagerung der Beine":
    "Text - Hochlagerung der Beine.pdf",
  "Text - Kompressionsverband":
    "Text - Kompressionsverband.pdf",
  "Text - Medizinischer Thromboseprophylaxestrumpf":
    "Text - Medizinischer Thromboseprophylaxestrumpf-1.pdf",
}

const REPO_URL =
  "https://github.com/solidphoenix/Lerngruppe26/raw/main/pdf-uploads"

/**
 * Returns a download URL for a given display name.
 * Falls back to undefined if no matching PDF exists.
 */
export function getPdfUrl(displayName: string): string | undefined {
  const filename = pdfMap[displayName]
  if (!filename) return undefined
  return `${REPO_URL}/${encodeURIComponent(filename)}`
}
