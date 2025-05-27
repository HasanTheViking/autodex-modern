import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../lib/firebase'
import { collection, query, where, orderBy, onSnapshot, doc, onSnapshot as profileSnap } from 'firebase/firestore'

export default function Profile() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [points, setPoints] = useState(0)

  // Ak nie je user, presmeruj na login
  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading])

  // Načítanie objednávok a bodov
  useEffect(() => {
    if (!user) return

    // orders
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    const off1 = onSnapshot(q, snap =>
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )

    // points z profilu
    const off2 = profileSnap(
      doc(db, 'profiles', user.uid),
      docSnap => setPoints(docSnap.data()?.points || 0)
    )

    return () => { off1(); off2() }
  }, [user])

  if (loading || !user) return <p>Načítavam...</p>

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Môj účet</h1>
      <div>
        <p><strong>Meno:</strong> {user.displayName}</p>
        <p><strong>E-mail:</strong> {user.email}</p>
        <p><strong>Body:</strong> {points}</p>
        <button onClick={logout} className="mt-2 text-red-600">Odhlásiť</button>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">História objednávok</h2>
        {orders.length === 0 && <p>Zatiaľ žiadne objednávky.</p>}
        <ul className="space-y-4">
          {orders.map(o => (
            <li key={o.id} className="border p-4 rounded">
              <div className="text-sm text-gray-500">
                {new Date(o.createdAt.seconds * 1000).toLocaleString()}
              </div>
              <ul className="mt-2">
                {o.items.map(i => (
                  <li key={i.id}>
                    {i.name} x{i.qty} — {(i.price * i.qty).toFixed(2)} €
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
