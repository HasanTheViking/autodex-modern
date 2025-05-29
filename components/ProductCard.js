// components/ProductCard.js
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
      {/* Obrázok s pevným pomerom strán */}
      <Link href={`/product/${product.id}`}>
        <a className="relative block w-full h-48">
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        </a>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        {/* Názov produktu */}
        <Link href={`/product/${product.id}`}>
          <a className="text-lg font-semibold mb-2 hover:text-primary">
            {product.name}
          </a>
        </Link>

        {/* Popis (max. 2 riadky) */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Cena + tlačidlo */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {product.price.toFixed(2)} €
          </span>
          <button
            onClick={() => addToCart({ ...product, qty: 1 })}
            className="bg-primary text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            + Košík
          </button>
        </div>
      </div>
    </div>
  )
}
