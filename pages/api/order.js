// pages/api/order.js
import { db } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { cart, data } = req.body

  try {
    // 1) uložíme objednávku do Firestore
    const orderRef = await addDoc(collection(db, 'orders'), {
      uid: data.uid || '',
      items: cart,
      total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
      createdAt: serverTimestamp(),
      status: 'pending',
      shipping: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        address: data.address,
        postalcode: data.postalcode,
        note: data.note || ''
      }
    })

    // 2) emailová notifikácia
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.NOTIFY_TO, // sem daj svoj e-mail
      subject: `Nová objednávka #${orderRef.id}`,
      text: `
Objednávka: ${orderRef.id}
Meno: ${data.name}
E-mail: ${data.email}
Telefón: ${data.phone}
Adresa: ${data.address}, ${data.postalcode} ${data.city}
Poznámka: ${data.note || '-'}
Suma: ${cart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2)} €
      `
    })

    // 3) vrátime platný JSON
    return res.status(200).json({
      ok: true,
      orderId: orderRef.id
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}