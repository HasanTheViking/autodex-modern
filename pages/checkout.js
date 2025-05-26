import { useCart } from '../components/CartContext'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Checkout() {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const isCod = router.query.cod === 'true'
  const [sending, setSending] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true)
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      address: e.target.address.value
    }
    const res = await fetch(isCod ? '/api/order' : '/api/checkout', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ cart, data })
    })
    const json = await res.json()
    if (!isCod && json.url) window.location = json.url
    if (isCod && json.ok) {
      clearCart()
      router.push('/kontakt?sent=true')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input name="name" placeholder="Meno" required className="border p-2 rounded w-full" />
      <input name="email" type="email" placeholder="E-mail" required className="border p-2 rounded w-full" />
      <input name="phone" placeholder="Telefón" required className="border p-2 rounded w-full" />
      <input name="address" placeholder="Adresa" required className="border p-2 rounded w-full" />
      <button type="submit" disabled={sending} className="bg-primary text-light px-4 py-2 w-full rounded">
        {sending ? 'Spracovávam...' : (isCod ? 'Odoslať objednávku' : 'Pokračovať na platbu')}
      </button>
    </form>
  )
}
