// pages/api/checkout.js

import Stripe from 'stripe'
import { db } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metóda nie je povolená' })
  }

  try {
    const { cartItems, total, address, contact, user } = req.body

    // 1. Overenie vstupov
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Košík je prázdny alebo nesprávny formát.')
    }
    if (typeof total !== 'number' || total <= 0) {
      throw new Error('Neplatná suma za nákup.')
    }
    if (
      !address ||
      typeof address.street !== 'string' ||
      typeof address.city !== 'string' ||
      typeof address.zip !== 'string'
    ) {
      throw new Error('Neplatné údaje o adrese.')
    }
    if (
      !contact ||
      typeof contact.name !== 'string' ||
      typeof contact.email !== 'string' ||
      typeof contact.phone !== 'string'
    ) {
      throw new Error('Neplatné kontaktné údaje.')
    }
    if (!user || typeof user.uid !== 'string') {
      throw new Error('Používateľ nie je prihlásený.')
    }

    // 2. Príprava položiek pre Stripe
    const line_items = cartItems.map((item) => {
      if (
        !item.name ||
        typeof item.name !== 'string' ||
        typeof item.price !== 'number' ||
        typeof item.qty !== 'number' ||
        item.price < 0 ||
        item.qty <= 0
      ) {
        throw new Error('Neplatné údaje o položke v košíku.')
      }
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      }
    })

    // 3. Vytvorenie Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: contact.email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata: {
        userId: user.uid,
      },
    })

    // 4. Uloženie objednávky do Firestore
    await addDoc(collection(db, 'orders'), {
      userId: user.uid,
      items: cartItems,
      amount: total,
      address,
      contact,
      status: 'pending',
      createdAt: serverTimestamp(),
      sessionId: session.id,
    })

    // 5. Vraciame URL pre presmerovanie
    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('❌ Checkout error:', err)
    return res.status(400).json({ error: err.message })
  }
}
