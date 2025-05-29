// pages/checkout.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '../components/CartContext'

export default function Checkout() {
  const router = useRouter()
  const isCod = router.query.cod === 'true'
  const { cart, clearCart } = useCart()
  const [sending, setSending] = useState(false)
  const [total, setTotal] = useState(0)

  // prepocítame total
  useEffect(() => {
    setTotal(cart.reduce((sum, i) => sum + i.price * i.qty, 0))
  }, [cart])

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true)
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      city: e.target.city.value,
      address: e.target.address.value,
      postalcode: e.target.postalcode.value,
      note: e.target.note.value,
    }
    try {
      const res = await fetch(
        isCod ? '/api/order' : '/api/checkout',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart, data }),
        }
      )
      const json = await res.json()
      if (!isCod && json.url) {
        window.location = json.url
      } else if (isCod && json.ok) {
        clearCart()
        router.push('/?ordered=true')
      } else {
        throw new Error(json.error || 'Chyba pri spracovaní')
      }
    } catch (err) {
      alert('Chyba: ' + err.message)
      setSending(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-6 text-center text-gray-600">
        <p>Váš košík je prázdny.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Vrátiť sa na nákup
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-md mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-primary">
            {isCod ? 'Objednávka na dobierku' : 'Pokračovať na platbu'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Meno a priezvisko</label>
              <input
                name="name"
                required
                className="mt-1 w-full border rounded p-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">E-mail</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full border rounded p-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Telefón</label>
              <input
                name="phone"
                type="tel"
                required
                pattern="\d*"
                inputMode="numeric"
                className="mt-1 w-full border rounded p-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mesto</label>
              <input
                name="city"
                required
                className="mt-1 w-full border rounded p-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Ulica a číslo</label>
              <input
                name="address"
                required
                className="mt-1 w-full border rounded p-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">PSČ</label>
              <input
                name="postalcode"
                required
                pattern="\d{4,5}"
                title="Zadajte platné PSČ (4–5 číslic)"
                inputMode="numeric"
                className="mt-1 w-full border rounded p-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Poznámka (voliteľné)</label>
              <textarea
                name="note"
                className="mt-1 w-full border rounded p-2 focus:ring-primary focus:border-primary"
                rows="3"
              />
            </div>
            <div className="text-right text-lg font-bold">
              Suma k úhrade: {total.toFixed(2)} €
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-primary text-white py-3 rounded hover:bg-red-700 transition disabled:opacity-50"
            >
              {sending
                ? 'Spracovávam...'
                : isCod
                ? 'Odoslať objednávku'
                : 'Prejsť na platbu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
