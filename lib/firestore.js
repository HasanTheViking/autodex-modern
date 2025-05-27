// lib/firestore.js
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from './firebase'

/**
 * Načíta všetky objednávky pre dané userId, zoradené od najnovších
 * @param {string} uid - Firebase UID používateľa
 * @returns {Promise<Array<{ id: string, date: Date|null, total: number, status: string }>>}
 */
export async function getUserOrders(uid) {
  // Definujeme query: kolekcia 'orders', kde userId == uid, zoradené podľa createdAt desc
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc')
  )

  // Spustíme načítanie
  const snapshot = await getDocs(q)

  // Transformujeme dokumenty na požadovaný tvar
  const orders = snapshot.docs.map(doc => {
    const data = doc.data()

    // Konverzia Firestore Timestamp na JS Date
    const date = data.createdAt && data.createdAt.toDate
      ? data.createdAt.toDate()
      : null

    // Spočítanie celkovej sumy objednávky (1 bod = 1 €), ak máme pole items
    const total = Array.isArray(data.items)
      ? data.items.reduce(
          (sum, item) => sum + (item.price || 0) * (item.qty || 1),
          0
        )
      : 0

    // Stav objednávky - prednastavená hodnota, prípadne môžeš ukladať do Firestore pri vytváraní objednávky
    const status = data.status || 'Vytvorená'

    return {
      id: doc.id,
      date,
      total,
      status
    }
  })

  return orders
}
