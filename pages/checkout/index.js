// pages/checkout/index.js
// ------------------------

import { useState, useEffect } from 'react'
import { useCart } from '../../components/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/router'

export default function Checkout() {
  const { cartItems, total } = useCart()
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  // Ak je košík prázdny, presmeruj späť na hlavnú stránku (napr. produkty)
  useEffect(() => {
    if (!cartItems.length) {
      router.replace('/')
    }
  }, [cartItems, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Musíš byť prihlásený')
      return
    }
    setProcessing(true)

    const address = {
      street: e.target.street.value,
      city:   e.target.city.value,
      zip:    e.target.zip.value
    }
    const contact = {
      name:  user.displayName || '',
      email: user.email,
      phone: e.target.phone.value
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          total,
          address,
          contact,
          user: { uid: user.uid }
        })
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err) {
      alert('Chyba pri spracovaní objednávky: ' + err.message)
      setProcessing(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Doprava a platba</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Telefón</label>
          <input
            name="phone"
            type="tel"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Ulica a číslo</label>
          <input
            name="street"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Mesto</label>
            <input
              name="city"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">PSČ</label>
            <input
              name="zip"
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="text-xl font-bold mb-4">
          Suma k úhrade: {total.toFixed(2)} €
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full py-3 bg-primary text-white rounded disabled:opacity-50"
        >
          {processing ? 'Spracovávam…' : 'Pokračovať na platbu'}
        </button>
      </form>
    </div>
  )
}