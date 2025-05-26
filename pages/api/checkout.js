import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { cart } = req.body
  const line_items = cart.map(i => ({
    price_data: {
      currency: 'eur',
      product_data: { name: i.name },
      unit_amount: Math.round(i.price * 100)
    },
    quantity: i.qty
  }))
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${req.headers.origin}/kontakt?sent=true`,
    cancel_url: `${req.headers.origin}/kosik`
  })
  res.status(200).json({ url: session.url })
}
