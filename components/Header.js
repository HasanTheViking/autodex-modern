// components/Header.js
import Link from 'next/link'
import { useCart } from '../components/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

export default function Header() {
  const { cart, points } = useCart()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <a className="text-2xl font-bold text-red-500">AutoDex</a>
        </Link>

        <nav className="flex-wrap items-center space-x-4">
          <Link href="/">
            <a className="hover:text-red-400">Domov</a>
          </Link>

          <Link href="/kosik">
            <a className="relative hover:text-red-400">
              Košík
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-xs rounded-full px-1">
                  {itemCount}
                </span>
              )}
            </a>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center space-x-2 hover:text-red-400 focus:outline-none"
              >
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  {user.displayName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <span>{user.displayName}</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded shadow-lg">
                  <Link href="/profile">
                    <a className="block px-4 py-2 hover:bg-gray-100">Môj účet</a>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Odhlásiť
                  </button>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Body: {points}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/register">
                <a className="hover:text-red-400">Registrovať</a>
              </Link>
              <Link href="/auth/login">
                <a className="hover:text-red-400">Prihlásiť</a>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
