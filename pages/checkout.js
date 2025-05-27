// pages/checkout.js
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
      address: e.target.address.value,
      city: e.targer.city.value,
      postalcode: e.target.postalcode.value  // pridané PSČ
    }

    try {
      const res = await fetch(isCod ? '/api/order' : '/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, data })
      })
      const json = await res.json()

      if (!isCod && json.url) {
        window.location = json.url
      } else if (isCod && json.ok) {
        clearCart()
        router.push('/kontakt?sent=true')
      } else {
        throw new Error(json.error || 'Chyba pri spracovaní')
      }
    } catch (err) {
      alert('Chyba: ' + err.message)
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        name="name"
        placeholder="Meno"
        required
        className="border p-2 rounded w-full"
      />
      <input
        name="email"
        type="email"
        placeholder="E-mail"
        required
        className="border p-2 rounded w-full"
      />
      <input
        name="phone"
        type="tel"
        placeholder="Telefón"
        required
        pattern="\d*"
        inputMode="numeric"
        className="border p-2 rounded w-full"
      />
      <input
        name="city"
        placeholder="Mesto"
        required
        className="border p-2 rounded w-full"
      />
      <input
        name="address"
        placeholder="Ulica"
        required
        className="border p-2 rounded w-full"
      />
      <input
        name="postalcode"
        placeholder="PSČ"
        required
        pattern="\d{4,5}"
        title="Zadajte platné PSČ (4–5 číslic)"
        inputMode="numeric"
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={sending}
        className="bg-primary text-light px-4 py-2 w-full rounded"
      >
        {sending
          ? 'Spracovávam...'
          : isCod
          ? 'Odoslať objednávku'
          : 'Pokračovať na platbu'}
      </button>
    </form>
  )
}
