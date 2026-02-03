import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

// Firebase configuration
// These values should be set via environment variables for production
// Copy .env.example to .env.local and fill in your Firebase project values
const firebaseConfig = {
  apiKey: "AIzaSyD5UVZr58RD7c9Bw6BAI-I9Yv3aQWjjFAI",
  authDomain: "bfglerngruppe26.firebaseapp.com",
  projectId: "bfglerngruppe26",
  storageBucket: "bfglerngruppe26.firebasestorage.app",
  messagingSenderId: "916290768574",
  appId: "1:916290768574:web:ab49eb13f1b93dc70d58ef"
};

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
