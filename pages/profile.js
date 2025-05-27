// pages/profile.js
import { getUserOrders } from '../lib/firestore'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUserOrders } from '../lib/firestore' // predpokladáme utilku na načítanie objednávok

export default function Profile() {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getUserOrders(user.uid)
      .then(fetched => setOrders(fetched))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return null

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Môj účet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* UŽÍVATEĽSKÉ INFO */}
        <div className="col-span-1 bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-500 text-2xl">
            {user.displayName?.charAt(0) || user.email.charAt(0)}
          </div>
          <h2 className="text-xl font-semibold">{user.displayName}</h2>
          <p className="text-gray-600">{user.email}</p>
          <div className="mt-4 px-4 py-2 bg-red-100 text-red-700 font-bold rounded-full">
            Body: {user.points || 0}
          </div>
          <button
            onClick={logout}
            className="mt-6 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
          >
            Odhlásiť sa
          </button>
        </div>

        {/* Štatistiky / vernostný program */}
        <div className="col-span-2 bg-white shadow rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">História objednávok</h3>

          {loading ? (
            <p className="text-gray-600">Načítavam objednávky…</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-600">Zatiaľ žiadne objednávky.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">ID</th>
                    <th className="px-4 py-2 border-b">Dátum</th>
                    <th className="px-4 py-2 border-b">Suma</th>
                    <th className="px-4 py-2 border-b">Stav</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{o.id}</td>
                      <td className="px-4 py-2 border-b">{new Date(o.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border-b">{o.total.toFixed(2)} €</td>
                      <td className="px-4 py-2 border-b capitalize">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
