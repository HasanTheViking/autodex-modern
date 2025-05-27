// pages/product/[id].js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { products } from '../../data/products'
import { useCart } from '../../components/CartContext'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const product = products.find(p => p.id === parseInt(id))
  const { addToCart } = useCart()

  const [qty, setQty] = useState(1)
  const [current, setCurrent] = useState(0)
  if (!product) return null

  const prev = () => setCurrent(i => (i - 1 + product.images.length) % product.images.length)
  const next = () => setCurrent(i => (i + 1) % product.images.length)

  return (
    <main className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* carousel */}
        <div className="relative w-full md:w-1/2 h-64 md:h-[400px]">
          <Image
            src={product.images[current]}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
          />
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
          >‹</button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
          >›</button>
        </div>

        {/* detail */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>
          <div className="text-2xl font-bold text-primary">{product.price} €</div>

          <div className="flex items-center space-x-2">
            <label htmlFor="qty" className="font-medium">Množstvo:</label>
            <input
              id="qty"
              type="number"
              min="1"
              value={qty}
              onChange={e => setQty(parseInt(e.target.value))}
              className="w-20 border p-1 rounded"
            />
          </div>

          <button
            onClick={() => {
              addToCart({ ...product, qty })
            }}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Pridať do košíka
          </button>
        </div>
      </div>
    </main>
  )
}
