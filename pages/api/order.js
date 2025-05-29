// pages/api/order.js
import { getAuth } from 'firebase/auth'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { cart, data } = req.body

  // over, že používateľ je prihlásený
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) return res.status(401).json({ error: 'Nie ste prihlásený.' })

  try {
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

    const orderRef = await addDoc(collection(db, 'orders'), {
      uid: user.uid,
      items: cart,
      total,
      status: 'pending',
      date: serverTimestamp(),    // tu firebase doplní presný čas
      // prípadne ďalšie polia (note, city, postalcode...)
      info: data,
    })

    return res.status(200).json({ ok: true, id: orderRef.id })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Chyba pri ukladaní objednávky.' })
  }
}