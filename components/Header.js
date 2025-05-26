import Link from 'next/link'
import { useCart } from './CartContext'

export default function Header() {
  const { cart } = useCart()
  const count = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <header className="bg-gray-800 text-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/"><a className="text-2xl font-bold text-primary">AutoDex</a></Link>
        <nav className="space-x-6">
          <Link href="/"><a className="hover:text-primary">Domov</a></Link>
          <Link href="/kosik">
            <a className="relative hover:text-primary">
              Košík
              {count > 0 && (
                <span className="ml-1 bg-primary text-light text-xs rounded-full px-2">
                  {count}
                </span>
              )}
            </a>
          </Link>
        </nav>
      </div>
    </header>
  )
}
