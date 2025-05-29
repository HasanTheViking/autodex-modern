// pages/api/checkout.js
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { cart, data } = req.body

  try {
    // 1) Uloženie objednávky do Firestore
    const orderRef = await addDoc(collection(db, 'orders'), {
      items: cart,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postalcode: data.postalcode,
      note: data.note || '',
      uid: data.uid || '',
      status: 'pending',
      createdAt: serverTimestamp()
    })

    // 2) Odoslanie e-mailu s notifikáciou
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_TO,
      subject: `Nová objednávka #${orderRef.id}`,
      text: `
Objednávka: ${orderRef.id}
Meno: ${data.name}
E-mail: ${data.email}
Telefón: ${data.phone}
Adresa: ${data.address}, ${data.city}, ${data.postalcode}
Poznámka: ${data.note || '-'}
Suma: ${cart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2)} €
      `
    })

    // 3) Všetko OK
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('❌ Checkout error:', err)
    // dočasne pošli klientovi presné err.message, aby sme videli, kde to padá
    return res.status(500).json({ error: err.message || String(err) })
  }
}