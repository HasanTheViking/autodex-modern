// pages/api/checkout.js
import Stripe from 'stripe'
import nodemailer from 'nodemailer'
import { db } from '../../lib/firebase'   // <-- presne takto!

export const config = {
  api: {
    bodyParser: true,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { cart, data } = req.body

    // 1) Ulož objednávku do Firestore
    const orderRef = await db.collection('orders').add({
      userId: data.uid || null,
      items: cart,
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        address: data.address,
        postalcode: data.postalcode,
        note: data.note,
      },
      status: 'pending',
      createdAt: new Date(),
    })

    // 2) Vytvor Stripe Checkout session
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
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/kosik`,
      metadata: {
        orderId: orderRef.id,
      },
    })

    // 3) Pošli email potvrdenia (voliteľné)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? '465'),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"AutoDex" <${process.env.MAIL_USER}>`,
      to: data.email,
      subject: 'Potvrdenie objednávky',
      text: `Ďakujeme za objednávku ${orderRef.id}. Pokračujte na platbu: ${session.url}`,
    })

    // 4) vráť klientovi URL pre platbu
    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('❌ Checkout error:', err)
    // Naplno vrátime chybovú správu, aby si ju videl počas debugovania
    return res.status(500).json({ error: err.message || String(err) })
  }
}