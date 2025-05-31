// lib/firebase.js
// ------------------------

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase konfiguračné údaje pre tvoj projekt.
// Uisti sa, že si vo Vercel nastavil nasledujúce premenné (Settings → Environment Variables):
//   NEXT_PUBLIC_FIREBASE_API_KEY
//   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
//   NEXT_PUBLIC_FIREBASE_PROJECT_ID
//   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
//   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
//   NEXT_PUBLIC_FIREBASE_APP_ID
//
// Napr. v Dashboarde Vercel → Your Project → Settings → Environment Variables:
//   Key:  NEXT_PUBLIC_FIREBASE_API_KEY        Value: "tvoje-firebase-apiKey"
//   Key:  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN    Value: "mojprojekt.firebaseapp.com"
//   Key:  NEXT_PUBLIC_FIREBASE_PROJECT_ID     Value: "mojprojekt-id"
//   Key:  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET Value: "mojprojekt.appspot.com"
//   Key:  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID Value: "…"
//   Key:  NEXT_PUBLIC_FIREBASE_APP_ID         Value: "1:…:web:…"
//
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Inicializácia Firebase app iba raz
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Export služby, ktoré budeme potrebovať
export const auth = getAuth(app)
export const db   = getFirestore(app)