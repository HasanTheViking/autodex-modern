// pages/index.js
import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'

export default function Home({ products }) {
  const [filter, setFilter] = useState('all')
  const categories = ['all', ...new Set(products.map(p => p.category))]

  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter)

  return (
    <div className="flex flex-col lg:flex-row">
      {/* --- MOBILE CATEGORIES as horizontal scroll --- */}
      <div className="block lg:hidden overflow-x-auto py-2 px-4 bg-gray-100">
        <div className="inline-flex space-x-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${
                filter === cat
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              {cat === 'all'
                ? 'Všetko'
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:block w-1/4 p-4 border-r bg-gray-50">
        <h2 className="text-lg font-bold mb-4">Kategórie</h2>
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat}>
              <button
                onClick={() => setFilter(cat)}
                className={`w-full text-left px-3 py-2 rounded ${
                  filter === cat
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-200'
                }`}
              >
                {cat === 'all'
                  ? 'Všetko'
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* --- MAIN CONTENT: PRODUCTS GRID --- */}
      <main className="flex-1 p-4">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  return { props: { products } }
}
