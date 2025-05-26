import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { cart, data } = req.body
  const items = cart.map(i => `${i.name} x${i.qty}`).join('\n')
  const text = `Nová objednávka:\n${items}\n\n${JSON.stringify(data, null, 2)}`
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: process.env.MY_EMAIL,
    subject: 'Nová objednávka (dobierka)',
    text
  })
  res.status(200).json({ ok: true })
}
