// pages/kosik.js
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../components/CartContext'
import { useState, useEffect } from 'react'

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart()
  const [total, setTotal] = useState(0)

  // Prepočítame total vždy, keď sa zmení cart
  useEffect(() => {
    setTotal(
      cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    )
  }, [cart])

  return (
    <div className="container mx-auto py-6 flex flex-col min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Nákupný košík</h1>

      {cart.length === 0 ? (
        <div className="flex-grow text-center text-gray-600">
          <p>Váš košík je prázdny.</p>
          <Link href="/">
            <a className="inline-block mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Pokračovať v nákupe
            </a>
          </Link>
        </div>
      ) : (
        <div className="flex-grow space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center bg-white shadow rounded-lg overflow-hidden">
              {/* Thumbnail */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-500 text-sm">{item.price.toFixed(2)} € / ks</p>
                </div>

                {/* Qty selector */}
                <div className="flex items-center space-x-2">
                  <label htmlFor={`qty-${item.id}`} className="text-sm">Množstvo:</label>
                  <input
                    id={`qty-${item.id}`}
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={e => updateQty(item.id, parseInt(e.target.value) || 1)}
                    className="w-16 border p-1 rounded text-center"
                  />
                </div>

                {/* Subtotal + remove */}
                <div className="flex items-center justify-between">
                  <span className="font-bold">{(item.price * item.qty).toFixed(2)} €</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Odstrániť
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Spodný pás s totalom a tlačidlami */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t p-4 flex flex-col sm:flex-row items-center justify-between shadow-inner">
          <div className="text-xl font-bold mb-2 sm:mb-0">
            Celkom: {total.toFixed(2)} €
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/checkout?cod=true">
              <a className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition text-center">
                Objednať na dobierku
              </a>
            </Link>
            <Link href="/checkout">
              <a className="bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition text-center">
                Pokračovať na platbu
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
