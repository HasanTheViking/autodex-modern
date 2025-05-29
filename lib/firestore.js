// lib/firestore.js
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs 
} from 'firebase/firestore'
import { db } from './firebase'

/**
 * Načíta všetky objednávky pre dané uid, zoradené od najnovších.
 * @param {string} uid - Firebase UID používateľa
 * @returns {Promise<Array<{ id: string, date: Date|null, total: number, status: string }>>}
 */
export async function getUserOrders(uid) {
  // 1) query na kolekciu 'orders'
  const q = query(
    collection(db, 'orders'),
    where('uid', '==', uid),        // hľadáme iba tie objednávky, ktoré patria danému používateľovi
    orderBy('date', 'desc')         // zoradíme od najnovšej po najstaršiu
  )

  // 2) vykonáme query
  const snapshot = await getDocs(q)

  // 3) namapujeme dokumenty do požadovaného tvaru
  return snapshot.docs.map(doc => {
    const data = doc.data()

    // prevedieme Firestore Timestamp na JS Date, alebo null ak chýba
    const date = data.date?.toDate ? data.date.toDate() : null

    // priamo čítame total a status
    const total = typeof data.total === 'number' ? data.total : 0
    const status = data.status || 'unknown'

    return {
      id: doc.id,
      date,
      total,
      status
    }
  })
}