import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = { /* tvoje kľúče */ }

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0]

export const db = getFirestore(app)
export const auth = getAuth(app)