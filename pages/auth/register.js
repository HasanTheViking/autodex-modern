import { useState } from 'react'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    try {
      // 1) Vytvorenie účtu v Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      // 2) Doplníme displayName
      await updateProfile(cred.user, { displayName: name })
      // 3) Vytvoríme záznam v Firestore pre profil s 0 bodmi
      await setDoc(doc(db, 'profiles', cred.user.uid), {
        name,
        email,
        points: 0
      })
      // 4) Presmerujeme na login
      router.push('/auth/login')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Registrácia</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Meno"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-red-700 transition"
        >
          Registrovať
        </button>
      </form>
    </div>
  )
}
