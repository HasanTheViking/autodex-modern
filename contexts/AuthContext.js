// contexts/AuthContext.js
// ------------------------

import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'

const AuthContext = createContext({})

// Hook na jednoduchý prístup k AuthContext z komponentov
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Tento efectos sleduje stav prihlásenia vo Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser(fbUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Funkcia na registráciu nového používateľa
  async function register(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    if (auth.currentUser && displayName) {
      // Nastav displayName, ak bolo odovzdané
      await updateProfile(auth.currentUser, { displayName })
    }
    return userCredential.user
  }

  // Funkcia na prihlásenie existujúceho používateľa
  async function login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password)
  }

  // Funkcia na odhlásenie
  function logout() {
    return signOut(auth)
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}