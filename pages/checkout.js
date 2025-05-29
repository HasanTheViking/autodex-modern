// pages/api/checkout.js

import Stripe from 'stripe'
import { db } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Inicializácia Stripe s kľúčom z ENV
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  // --- debug výpisy – skontroluj, či ENV premenné existujú
  console.log('🔑 STRIPE_SECRET_KEY:', !!process.env.STRIPE_SECRET_KEY)
  console.log('🌐 NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { cart, data } = req.body

  try {
    // Vytvorenie Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // v centoch
        },
        quantity: item.qty,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/kontakt?sent=true`,
      cancel_url:  `${process.env.NEXT_PUBLIC_BASE_URL}/kosik`,
    })

    // Uloženie objednávky do Firestore
    await addDoc(collection(db, 'orders'), {
      ...data,              // meno, email, telefón, adresa, mesto, PSČ, poznámka
      items: cart,          // obsah košíka
      status: 'pending',    // počiatočný stav
      createdAt: serverTimestamp(),
      sessionId: session.id // prepojenie na Stripe session
    })

    // Vrátime klientovi URL pre presmerovanie na Stripe Checkout
    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('❌ Checkout error:', err)
    // Pre testovanie pošleme klientovi chybovú správu
    return res.status(500).json({ error: err.message || 'Chyba pri spracovaní objednávky' })
  }
}