// pages/api/checkout.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15'
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Použi POST' })
  }

  const { cartItems, total, address, contact, user } = req.body

  if (!user?.uid) {
    return res.status(400).json({ error: 'Chýba UID používateľa' })
  }

  try {
    // Vytvor Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.qty
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata: { uid: user.uid }
    })

    // Ulož objednávku do Firestore
    await addDoc(collection(db, 'orders'), {
      uid:        user.uid,
      items:      cartItems,
      total,
      address,
      contact,
      status:     'pending',
      createdAt:  serverTimestamp()
    })

    // Vráťme URL na presmerovanie
    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('❌ Checkout error:', err)
    res.status(500).json({ error: err.message || String(err) })
  }
}