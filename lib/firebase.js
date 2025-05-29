// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ďalšie polia ak ich máš
}

// Ak ešte nie je žiadna inštancia, initializeApp, inak použi už existujúcu:
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0]

// Tu sa naozaj exportujú obe premenné:
export const auth = getAuth(app)
export const db   = getFirestore(app)