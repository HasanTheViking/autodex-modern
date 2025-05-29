// pages/api/checkout.js

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { cart = [], data = {} } = req.body

  try {
    // Vytvoriť session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/kontakt?sent=true`,
      cancel_url: `${req.headers.origin}/checkout?cod=false`,
      metadata: {
        // prenesiem aj meno/telefon/adresu na neskoršie spracovanie webhookom
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        address: data.address,
        postalcode: data.postalcode,
        note: data.note || '',
      },
    })

    // Poslať URL pre presmerovanie
    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('🛑 CHECKOUT API ERROR:', err)
    return res.status(500).json({ error: 'Chyba pri vytváraní platobnej session' })
  }
}