// pages/api/order.js
// ------------------------

import { db } from '../../lib/firebase'
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Iba GET je povolené' })
  }

  const { uid } = req.query
  if (!uid) {
    return res.status(400).json({ error: 'Chýba uid' })
  }

  try {
    const ordersCol = collection(db, 'orders')
    const q = query(
      ordersCol,
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    const orders = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        date: data.createdAt ? data.createdAt.toDate() : null,
        total: data.total || 0,
        status: data.status || 'Vytvorená'
      }
    })
    return res.status(200).json({ orders })
  } catch (err) {
    console.error('ORDER API ERROR:', err)
    return res.status(500).json({ error: err.message || String(err) })
  }
}