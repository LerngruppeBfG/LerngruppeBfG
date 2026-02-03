# Firebase Setup-Anleitung

Diese Anleitung hilft Ihnen, Firebase Firestore für die Cross-Device-Synchronisierung der Lerngruppen-Anmeldungen einzurichten.

## Schritt 1: Firebase-Projekt erstellen

1. Gehen Sie zu [Firebase Console](https://console.firebase.google.com/)
2. Klicken Sie auf "Projekt hinzufügen" oder "Add project"
3. Geben Sie einen Projektnamen ein (z.B. "lerngruppe26")
4. Folgen Sie den Anweisungen zur Projekterstellung
5. Google Analytics können Sie optional aktivieren

## Schritt 2: Firestore Database aktivieren

1. Wählen Sie Ihr Projekt in der Firebase Console
2. Klicken Sie im linken Menü auf "Firestore Database"
3. Klicken Sie auf "Datenbank erstellen" oder "Create database"
4. Wählen Sie den Modus:
   - **Testmodus** für Entwicklung (empfohlen für den Start)
   - **Produktionsmodus** für Live-Deployment
5. Wählen Sie einen Standort (z.B. europe-west3 für Frankfurt)

## Schritt 3: Firebase-Konfiguration abrufen

1. Gehen Sie zu Projekteinstellungen (Zahnrad-Symbol oben links)
2. Scrollen Sie zu "Ihre Apps" bzw. "Your apps"
3. Klicken Sie auf das Web-Symbol (</>)
4. Registrieren Sie Ihre App (z.B. "Lerngruppe Web App")
5. Kopieren Sie die Firebase-Konfiguration

## Schritt 4: Konfiguration in die Anwendung einfügen

### Option 1: Environment Variables (Empfohlen für Produktion)

1. Erstellen Sie eine `.env.local` Datei im Root-Verzeichnis des Projekts
2. Fügen Sie Ihre Firebase-Konfiguration ein:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=IHRE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=IHRE_PROJECT_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=IHRE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=IHRE_PROJECT_ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=IHRE_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=IHRE_APP_ID
```

### Option 2: Direkte Konfiguration (Nicht empfohlen)

Aus Sicherheitsgründen sollten Firebase-Zugangsdaten nicht im Quellcode hinterlegt werden. Nutzen Sie stattdessen `.env.local`, damit keine Zugangsdaten versioniert werden.

## Schritt 5: Firestore-Sicherheitsregeln einrichten

1. Gehen Sie in der Firebase Console zu "Firestore Database"
2. Klicken Sie auf den Tab "Regeln" bzw. "Rules"
3. Fügen Sie folgende Regeln ein:

### Für Entwicklung/Test (weniger restriktiv):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /participants/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Für Produktion (empfohlen):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /participants/{document=**} {
      // Jeder kann lesen
      allow read: if true;
      
      // Jeder kann neue Einträge erstellen
      allow create: if true;
      
      // Nur Einträge mit dem richtigen deleteToken können gelöscht werden
      allow delete: if request.auth != null || 
                       resource.data.deleteToken == request.resource.data.deleteToken;
    }
  }
}
```

4. Klicken Sie auf "Veröffentlichen" bzw. "Publish"

## Schritt 6: Anwendung neu starten

1. Stoppen Sie den Entwicklungsserver (falls er läuft)
2. Starten Sie ihn neu:
   ```bash
   npm run dev
   ```

## Schritt 7: Testen

1. Öffnen Sie die Anwendung in zwei verschiedenen Browsern oder auf zwei Geräten
2. Melden Sie sich in einem Browser/Gerät an
3. Die Anmeldung sollte automatisch im anderen Browser/Gerät erscheinen
4. Öffnen Sie die Browser-Konsole und suchen Sie nach Logs wie:
   - `[Firebase] Participant added with ID: ...`
   - `[Firebase] Real-time update received: X participants`

## Fehlerbehebung

### Fehler: "Firebase: Error (auth/api-key-not-valid)"
- Überprüfen Sie, ob die API-Schlüssel korrekt eingefügt wurden
- Stellen Sie sicher, dass keine Leerzeichen vor oder nach den Werten sind

### Fehler: "Missing or insufficient permissions"
- Überprüfen Sie die Firestore-Sicherheitsregeln
- Stellen Sie sicher, dass Sie die Regeln veröffentlicht haben

### Daten werden nicht synchronisiert
- Öffnen Sie die Browser-Konsole und suchen Sie nach Fehlermeldungen
- Überprüfen Sie, ob Firebase korrekt initialisiert wurde
- Stellen Sie sicher, dass Sie mit dem Internet verbunden sind

### Migration von localStorage-Daten
- Beim ersten Laden der Teilnehmerliste werden automatisch alle vorhandenen localStorage-Daten zu Firebase migriert
- Dies geschieht nur einmal und vermeidet Duplikate

## Wichtige Hinweise

- **Öffentliche Konfiguration**: Die Firebase-Konfigurationswerte (apiKey, projectId, etc.) sind öffentlich und können sicher im Client-Code gespeichert werden. Sie sind durch Firebase-Sicherheitsregeln geschützt.
- **Kosten**: Firebase bietet einen kostenlosen "Spark Plan" mit:
  - 50.000 Lesevorgänge/Tag
  - 20.000 Schreibvorgänge/Tag
  - 20.000 Löschvorgänge/Tag
  - 1 GB Speicher
- **Offline-Support**: Die Anwendung speichert Daten weiterhin in localStorage als Fallback/Cache
- **Real-Time**: Änderungen werden in Echtzeit auf allen verbundenen Geräten synchronisiert

## Support

Bei Problemen besuchen Sie:
- [Firebase Dokumentation](https://firebase.google.com/docs)
- [Firestore Dokumentation](https://firebase.google.com/docs/firestore)
- [Firebase Support](https://firebase.google.com/support)
