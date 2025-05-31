// pages/api/checkout.js
import Stripe from 'stripe'
import { getApps, initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Načítanie env premenných (v Vercel dashboard → Environment Variables)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

let app
if (!getApps().length) {
  app = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    // atď...
  })
}
const db = getFirestore(app)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Iba POST je povolený' })
  }

  try {
    const { cartItems, total, address, contact, user } = req.body

    // Kontrola dát
    if (!user?.uid || !Array.isArray(cartItems) || !total) {
      return res.status(400).json({ error: 'Neplatné vstupné parametre' })
    }

    // Vytvorenie session v Stripe
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // v centoch
      },
      quantity: item.qty,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: contact.email,
      metadata: {
        uid: user.uid,
      },
    })

    // Uloženie objednávky do Firestore
    const docRef = await addDoc(collection(db, 'orders'), {
      uid: user.uid,
      cartItems,
      total,
      address,
      contact,
      status: 'pending',
      createdAt: serverTimestamp(),
      checkoutSessionId: session.id,
    })

    // Vrátime URL, na ktorú má klient presmerovať
    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('❌ Checkout API error:', err)
    return res
      .status(500)
      .json({ error: err.message || 'Neznáma chyba na serveri' })
  }
}
