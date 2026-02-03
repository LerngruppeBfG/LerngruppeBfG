import { initializeApp, getApps, FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

// Firebase configuration
// These values should be set via environment variables for production
// Copy .env.example to .env.local and fill in your Firebase project values
const firebaseConfig: Partial<FirebaseOptions> = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
let app: FirebaseApp | null = null
let db: Firestore | null = null

if (typeof window !== 'undefined') {
  // Only initialize on client side
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isCompleteConfig = (config: Partial<FirebaseOptions>): config is Required<FirebaseOptions> =>
    Boolean(
      config.apiKey &&
      config.projectId &&
      config.authDomain &&
      config.appId &&
      config.storageBucket &&
      config.messagingSenderId
    )

  if (isCompleteConfig(firebaseConfig)) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }
    db = getFirestore(app)
  } else if (isDevelopment) {
    console.warn('[Firebase] Missing configuration. Firestore sync disabled.', {
      apiKey: Boolean(firebaseConfig.apiKey),
      authDomain: Boolean(firebaseConfig.authDomain),
      projectId: Boolean(firebaseConfig.projectId),
      storageBucket: Boolean(firebaseConfig.storageBucket),
      messagingSenderId: Boolean(firebaseConfig.messagingSenderId),
      appId: Boolean(firebaseConfig.appId)
    })
  } else {
    console.warn('[Firebase] Missing configuration. Firestore sync disabled. Check NEXT_PUBLIC_FIREBASE_* env vars.')
  }
}

export { db }
