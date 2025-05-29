// pages/api/checkout.js

import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metóda nie je povolená' })
  }

  const { cart, data } = req.body

  try {
    // vytvorenie transportéra pre odosielanie emailu
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: +process.env.SMTP_PORT === 465, // true pre 465, false pre ostatné
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // vygenerovanie HTML pre položky košíka
    const itemsHtml = cart
      .map(
        (i) =>
          `<li>${i.name} — ${i.qty}×${i.price.toFixed(2)} € = ${(i.qty * i.price).toFixed(2)} €</li>`
      )
      .join('')

    // poslanie správy
    await transporter.sendMail({
      from: `"AutoDex" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_TO,
      subject: `Nová objednávka od ${data.name}`,
      html: `
        <h1>Nová objednávka</h1>
        <p><strong>Meno:</strong> ${data.name}</p>
        <p><strong>E-mail:</strong> ${data.email}</p>
        <p><strong>Telefón:</strong> ${data.phone}</p>
        <p><strong>Adresa:</strong> ${data.city}, ${data.address}, ${data.postalcode}</p>
        <p><strong>Poznámka:</strong> ${data.note || '-'}</p>
        <h2>Položky:</h2>
        <ul>${itemsHtml}</ul>
        <p><strong>Celkom k úhrade:</strong> ${cart
          .reduce((sum, i) => sum + i.price * i.qty, 0)
          .toFixed(2)} €</p>
      `
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Chyba pri odosielaní e-mailu:', err)
    return res.status(500).json({ error: 'Chyba pri spracovaní objednávky' })
  }
}