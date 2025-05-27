import Link from 'next/link'
import { useCart } from './CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { cart, points } = useCart()
  const { user, logout } = useAuth()
  const count = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <header className="bg-gray-800 text-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/"><a className="text-2xl font-bold text-primary">AutoDex</a></Link>
        <nav className="flex items-center space-x-6">
          {user
            ? (
              <>
                <span>{user.displayName}</span>
                <button onClick={logout} className="hover:text-red-400">Odhlásiť</button>
              </>
            ) : (
              <>
                <Link href="/auth/register"><a className="hover:text-primary">Registrovať</a></Link>
                <Link href="/auth/login"><a className="hover:text-primary">Prihlásiť</a></Link>
              </>
            )
          }
          <span>Body: <strong>{points}</strong></span>
          <Link href="/kosik"><a className="relative hover:text-primary">
            Košík{count>0 && <span className="ml-1 bg-primary text-light text-xs rounded-full px-2">{count}</span>}
          </a></Link>
        </nav>
      </div>
    </header>
  )
}
