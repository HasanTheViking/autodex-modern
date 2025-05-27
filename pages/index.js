// pages/index.js
import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'

export default function Home({ products }) {
  // filter pre sidebar
  const [filter, setFilter] = useState('all')
  const categories = ['all', ...new Set(products.map(p => p.category))]

  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter)

  return (
    <div className="flex flex-col lg:flex-row">
      {/* --- SIDEBAR (len na desktop) --- */}
      <aside className="hidden lg:block w-1/4 p-4 border-r">
        <h2 className="font-bold mb-4">Kategórie</h2>
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

      {/* --- HLAVNÉ OBSAH (grid produktov) --- */}
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
