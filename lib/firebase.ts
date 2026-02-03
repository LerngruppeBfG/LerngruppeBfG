import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

// Firebase configuration
// These values should be set via environment variables for production
// Copy .env.example to .env.local and fill in your Firebase project values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyD5UVZr58RD7c9Bw6BAI-I9Yv3aQWjjFAI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "bfglerngruppe26.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "bfglerngruppe26",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "bfglerngruppe26.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "916290768574",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:916290768574:web:ab49eb13f1b93dc70d58ef"
}

// Initialize Firebase
let app: FirebaseApp | null = null
let db: Firestore | null = null

if (typeof window !== 'undefined') {
  // Only initialize on client side
  const hasConfig = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.authDomain &&
    firebaseConfig.appId
  )

  if (hasConfig) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }
    db = getFirestore(app)
  } else {
    console.warn('[Firebase] Missing configuration. Firestore sync disabled.')
  }
}

export { db }
