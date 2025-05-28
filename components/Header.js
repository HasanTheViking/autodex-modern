// components/Header.js
import Link from 'next/link'
import { useCart } from './CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { cart } = useCart()
  const { user, logout } = useAuth()

  // spočítame položky v košíku
  const count = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <header className="bg-dark text-light shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/">
          <a className="text-2xl font-bold text-primary">AutoDex</a>
        </Link>

        {/* Hlavná navigácia */}
        <nav className="flex flex-wrap items-center space-x-4 overflow-x-auto">
          <Link href="/">
            <a className="hover:text-primary">Domov</a>
          </Link>

          <Link href="/kosik">
            <a className="relative hover:text-primary">
              Košík
              {count > 0 && (
                <span className="absolute -top-2 -right-4 bg-primary text-white text-xs rounded-full px-1">
                  {count}
                </span>
              )}
            </a>
          </Link>

          {!user ? (
            <>
              <Link href="/auth/register">
                <a className="hover:text-primary">Registrovať</a>
              </Link>
              <Link href="/auth/login">
                <a className="hover:text-primary">Prihlásiť</a>
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile">
                <a className="hover:text-primary">Profil</a>
              </Link>
              <button
                onClick={logout}
                className="hover:text-primary focus:outline-none"
              >
                Odhlásiť
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
