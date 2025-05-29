// pages/checkout.js
import { useState } from 'react'
import { useCart } from '../components/CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function Checkout() {
  const { cartItems, total } = useCart()
  const { user }           = useAuth()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async e => {
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
      alert('Chyba: ' + err.message)
      setProcessing(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Doprava a platba</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... tvoje polia pre street, city, zip, phone ... */}
        <div className="text-xl font-bold">Suma: {total.toFixed(2)} €</div>
        <button
          type="submit"
          disabled={processing}
          className="w-full py-3 bg-primary text-white rounded"
        >
          {processing ? 'Spracovávam…' : 'Pokračovať na platbu'}
        </button>
      </form>
    </div>
  )
}