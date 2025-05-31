// components/CartContext.js
// -------------------------

import { createContext, useContext, useEffect, useState } from 'react'

// Explicitne definujeme defaultné hodnoty, aby sa predísť undefined
const CartContext = createContext({
  cartItems: [],
  total: 0,
  addToCart: () => {},
  removeFromCart: () => {}
})

// Hook, ktorým budeme v komponentoch získavať cartItems, total a funkcie
export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)

  function addToCart(product) {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        )
      } else {
        return [...prev, { ...product, qty: 1 }]
      }
    })
  }

  function removeFromCart(productId) {
    setCartItems(prev => prev.filter(p => p.id !== productId))
  }

  // Pri každej zmene cartItems prepočítame newTotal
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0
    )
    setTotal(newTotal)
  }, [cartItems])

  const value = {
    cartItems,
    total,
    addToCart,
    removeFromCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}