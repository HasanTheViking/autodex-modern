// components/Header.js
import Link from 'next/link'
import { useCart } from './CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { cart } = useCart()
  const { user, logout } = useAuth()

  const count = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <header className="bg-dark text-light shadow">
      <div className="container mx-auto flex items-center px-4 py-3">
        {/* Logo vľavo */}
        <Link href="/">
          <a className="text-2xl font-bold text-primary whitespace-nowrap">
            AutoDex
          </a>
        </Link>

        {/* Navigácia sa natiahne cez flex-1 a zarovná doprava */}
        <nav className="flex-1">
          <ul className="flex flex-wrap justify-end items-center space-x-6 overflow-x-auto">
            <li>
              <Link href="/">
                <a className="hover:text-primary whitespace-nowrap">Domov</a>
              </Link>
            </li>
            <li className="relative">
              <Link href="/kosik">
                <a className="hover:text-primary whitespace-nowrap">
                  Košík
                  {count > 0 && (
                    <span className="absolute -top-2 -right-4 bg-primary text-white text-xs rounded-full px-1">
                      {count}
                    </span>
                  )}
                </a>
              </Link>
            </li>

            {!user ? (
              <>
                <li>
                  <Link href="/auth/register">
                    <a className="hover:text-primary whitespace-nowrap">
                      Registrovať
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login">
                    <a className="hover:text-primary whitespace-nowrap">
                      Prihlásiť
                    </a>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/profile">
                    <a className="hover:text-primary whitespace-nowrap">
                      Profil
                    </a>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="hover:text-primary focus:outline-none whitespace-nowrap"
                  >
                    Odhlásiť
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
