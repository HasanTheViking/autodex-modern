import ProductCard from '../components/ProductCard'

const PRODUCTS = [
  { id: 1, name: 'Autokozmetika', price: 19.99, description: 'Kvalitná autokozmetika', image: '/placeholder.png' },
  { id: 2, name: 'Autodoplnok', price: 9.99, description: 'Praktický autodoplnok', image: '/placeholder.png' },
  { id: 3, name: 'Pneumatika', price: 49.99, description: 'Celoročná pneumatika', image: '/placeholder.png' },
]

export default function Home() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {PRODUCTS.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </section>
  )
}
