import { useCart } from '../components/CartContext'
import Link from 'next/link'

export default function Kosik() {
  const { cart, removeFromCart } = useCart()
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  if (cart.length === 0) {
    return <div className="text-center">Váš košík je prázdny.</div>
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {cart.map(item => (
        <div key={item.id} className="flex justify-between">
          <span>{item.name} x{item.qty}</span>
          <span>{(item.price * item.qty).toFixed(2)} €</span>
          <button onClick={() => removeFromCart(item.id)} className="text-red-600">Odstrániť</button>
        </div>
      ))}
      <div className="font-bold">Spolu: {total.toFixed(2)} €</div>
      <div className="mt-4 flex justify-between">
        <Link href="/checkout"><a className="bg-primary text-light px-4 py-2 rounded">Kartou</a></Link>
        <Link href="/checkout?cod=true"><a className="bg-gray-800 text-light px-4 py-2 rounded">Dobierka</a></Link>
      </div>
    </div>
  )
}
