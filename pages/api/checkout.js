// pages/checkout.js
import { useCart } from '../components/CartContext'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'      // <-- pridaj

export default function Checkout() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()                           // <-- pridaj
  const router = useRouter()
  const isCod = router.query.cod === 'true'
  const [sending, setSending] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true)

    const data = {
      uid: user?.uid || '',                            // <-- tu
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      city: e.target.city.value,
      address: e.target.address.value,
      postalcode: e.target.postalcode.value,
      note: e.target.note.value                     // <-- tu pridaj poznámku
    }

    try {
      const res = await fetch('/api/order', {        //  pri COD vždy POST na /api/order
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, data })
      })
      const json = await res.json()                  // teraz už vždy validné JSON

      if (json.ok) {
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
      {/* ... ostatné inputy ... */}
      <input
        name="note"
        placeholder="Poznámka"
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={sending}
        className="bg-primary text-white px-4 py-2 w-full rounded"
      >
        {sending ? 'Spracovávam...' : 'Odoslať objednávku'}
      </button>
    </form>
  )
}