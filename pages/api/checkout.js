// pages/api/checkout.js
import Stripe from 'stripe'
import { db } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import nodemailer from 'nodemailer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metóda nie je povolená' })
  }

  try {
    const { cartItems, user, address, contact, total } = req.body

    // 1) Uložíme objednávku do Firestore
    const orderRef = await addDoc(
      collection(db, 'orders'),
      {
        uid: user.uid,
        items: cartItems,
        address,
        contact,
        total,
        status: 'pending',
        createdAt: serverTimestamp()
      }
    )

    // 2) Vytvoríme Stripe Checkout session
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${orderRef.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`
    })

    // 3) (voliteľne) pošleme potvrdenie emailom cez nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
    await transporter.sendMail({
      from: `"AutoDex" <${process.env.SMTP_USER}>`,
      to: contact.email,
      subject: 'Potvrdenie objednávky',
      text: `Ďakujeme za objednávku #${orderRef.id}. Zaplaťte prosím tu: ${session.url}`
    })

    // 4) Vrátime klientovi redirect URL na Stripe
    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('❌ Checkout error:', err)
    // dočasne vrátime presnú chybu, neskôr môžeš zmeniť späť na generické hlásenie
    return res.status(500).json({ error: err.message || String(err) })
  }
}