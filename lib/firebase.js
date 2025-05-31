// lib/firebase.js

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Tu použijeme premenné z prostredia (Vercel/Vaše .env lokálne)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  // Ak v budúcnosti používaš aj další Firebase produkty, 
  // môžeš sem pridať aj napr. storageBucket, messagingSenderId, appId atď.
  // Pre tento príklad však stačia tieto tri polia.
}

// Inicializácia Firebase App
const app = initializeApp(firebaseConfig)

// Export Firestore databázy
const db = getFirestore(app)

// Export Firebase Auth
const auth = getAuth(app)

export { db, auth }
