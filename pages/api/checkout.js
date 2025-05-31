// pages/api/checkout.js
// ------------------------

import Stripe from 'stripe'
import { db } from '../../lib/firebase'
import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Iba POST je povolené' })
  }

  // 1) Over si, že máme všetky parametre
  const { cartItems, total, address, contact, user } = req.body
  if (
    !Array.isArray(cartItems) ||
    typeof total !== 'number' ||
    typeof address !== 'object' ||
    typeof contact !== 'object' ||
    !user ||
    !user.uid
  ) {
    return res.status(400).json({ error: 'Neplatné vstupné parametre' })
  }

  try {
    // 2) Ulož objednávku do Firestore
    const ordersCol = collection(db, 'orders')
    const newOrderRef = await addDoc(ordersCol, {
      userId: user.uid,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty
      })),
      total,
      status: 'pending',
      address,
      contact,
      createdAt: serverTimestamp()
    })

    // 3) Inicializuj Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw new Error('Chýba STRIPE_SECRET_KEY v env')
    }
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15'
    })

    // 4) Priprav line_items podľa položiek v košíku
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.qty
    }))

    // 5) Vytvor Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata: {
        orderId: newOrderRef.id
      }
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('❌ Checkout error:', err)
    return res.status(500).json({ error: err.message || String(err) })
  }
}