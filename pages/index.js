// pages/index.js
import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'

// Vygenerujeme si jedinečné kategórie z dát
const categories = [
  'Všetko',
  ...Array.from(
    new Set(
      products.map(p =>
        // Upravíme názov kategórie na “Title Case”
        p.category.charAt(0).toUpperCase() + p.category.slice(1)
      )
    )
  ),
]

export default function Home() {
  const [selected, setSelected] = useState('Všetko')

  // Podla vybratej kategórie vyfiltrujeme
  const filtered =
    selected === 'Všetko'
      ? products
      : products.filter(
          p =>
            p.category.toLowerCase() ===
            selected.toLowerCase()
        )

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Naše produkty</h1>

      {/* FILTER BAR */}
      <div className="mb-6 overflow-x-auto">
        <div className="inline-flex space-x-4">
          {categories.map(cat => {
            const active = cat === selected
            return (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                className={`
                  whitespace-nowrap
                  px-4 py-2 rounded-full font-medium
                  ${
                    active
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* PRODUKTOVÝ GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
