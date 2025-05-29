// pages/api/order.js

import nodemailer from 'nodemailer'
import { db } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { cart = [], data = {} } = req.body

  try {
    // 1) Spočítať sumu
    const total = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0
    )

    // 2) Uložiť objednávku do Firestore
    const docRef = await addDoc(collection(db, 'orders'), {
      uid: data.uid || '',
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      address: data.address,
      postalcode: data.postalcode,
      note: data.note || '',
      items: cart,
      total,
      status: 'pending',
      createdAt: serverTimestamp(),
    })

    // 3) Poslať e-mailom notifikáciu
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const htmlItems = cart
      .map(
        i =>
          `<li>${i.name} – ${i.qty} × ${i.price.toFixed(
            2
          )} € = ${(i.qty * i.price).toFixed(2)} €</li>`
      )
      .join('')

    await transporter.sendMail({
      from: `"AutoDex E-shop" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_TO,
      subject: `Nová objednávka #${docRef.id}`,
      html: `
        <h2>Objednávka #${docRef.id}</h2>
        <p><strong>Meno:</strong> ${data.name}</p>
        <p><strong>E-mail:</strong> ${data.email}</p>
        <p><strong>Tel.:</strong> ${data.phone}</p>
        <p><strong>Adresa:</strong> ${data.city}, ${data.address}, ${data.postalcode}</p>
        <p><strong>Poznámka:</strong> ${data.note || 'žiadna'}</p>
        <h3>Produkty:</h3>
        <ul>${htmlItems}</ul>
        <p><strong>Celkom:</strong> ${total.toFixed(2)} €</p>
      `,
    })

    // 4) Odpoveď pre frontend
    return res.status(200).json({ ok: true, orderId: docRef.id })
  } catch (err) {
    console.error('🛑 ORDER API ERROR:', err)
    return res.status(500).json({ error: 'Chyba pri spracovaní objednávky' })
  }
}