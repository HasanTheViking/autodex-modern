// components/ProductCard.js
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  
  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
        <div className="relative h-48 w-full">
          <Image
            src={product.images[0]}          // prvý obrázok z pola images
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">{product.price} €</span>
            <button
              onClick={e => { e.preventDefault(); addToCart(product) }}
              className="bg-primary text-white px-3 py-1 rounded-full hover:bg-red-700 transition"
            >
              + Košík
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
