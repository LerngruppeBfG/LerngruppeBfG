import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

// Firebase configuration
// These are public configuration values that are safe to expose in client-side code
const firebaseConfig = {
  apiKey: "AIzaSyBH8vX9x6K-X3oP8kQ3mN5hL6jT9wU2vY8",
  authDomain: "lerngruppe26.firebaseapp.com",
  projectId: "lerngruppe26",
  storageBucket: "lerngruppe26.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
}

// Initialize Firebase
let app: FirebaseApp
let db: Firestore

if (typeof window !== 'undefined') {
  // Only initialize on client side
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  db = getFirestore(app)
}

export { db }
