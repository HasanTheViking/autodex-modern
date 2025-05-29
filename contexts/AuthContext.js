// contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../lib/firebase'                     // <-- sem importuj to čo si exportoval
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // sledujeme stav prihlásenia
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login    = (email, pass) => signInWithEmailAndPassword(auth, email, pass)
  const register = (email, pass) => createUserWithEmailAndPassword(auth, email, pass)
  const logout   = ()             => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}