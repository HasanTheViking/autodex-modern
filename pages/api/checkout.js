// pages/api/checkout.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    const { cart, data } = req.body
    if (!cart || !data) {
      return res.status(400).json({ error: 'Missing cart or data' })
    }

    // 1) Uloženie do Firestore
    const docRef = await addDoc(collection(db, 'orders'), {
      ...data,
      items: cart,
      createdAt: serverTimestamp(),
      status: 'pending',
      userId: data.uid || ''
    })

    // 2) Príprava a odoslanie e-mailu
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,         // napr. "smtp.gmail.com"
      port: Number(process.env.SMTP_PORT), // napr. 465
      secure: true,
      auth: {
        user: process.env.SMTP_USER,       // tvoj SMTP user (e-mail)
        pass: process.env.SMTP_PASS        // app-password z Gmailu
      }
    })

    // spočítanie súčtu
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0)

    await transporter.sendMail({
      from: `"AutoDex E-shop" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_TO,           // kam má prísť notifikácia
      subject: `Nová objednávka #${docRef.id}`,
      text: `
Nová objednávka ${docRef.id}

Meno:       ${data.name}
E-mail:     ${data.email}
Telefón:    ${data.phone}
Adresa:     ${data.address}, ${data.city}, ${data.postalcode}
Poznámka:   ${data.note || '-'}

Produkty:
${cart.map(i => `• ${i.name} x${i.qty} = ${(i.price * i.qty).toFixed(2)} €`).join('\n')}

Celkovo:    ${total.toFixed(2)} €
      `
    })

    // 3) Odpoveď pre klienta
    return res.status(200).json({ ok: true, orderId: docRef.id })

  } catch (err) {
    console.error('❌ Checkout error:', err)
    return res.status(500).json({ error: 'Chyba pri spracovaní objednávky' })
  }
}