'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  /* 🔹 LOAD CART FROM localStorage ON APP LOAD */
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
  if (storedCart) {
    try {
      setCart(JSON.parse(storedCart))
    } catch (e) {
      console.error('Invalid cart data in localStorage')
      setCart([])
    }
  }
}, [])





  /* 🔹 SAVE CART TO localStorage ON CHANGE */
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // ADD TO CART
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find(p => p.id === product.id)

      if (existing) {
        return prevCart.map(p =>
          p.id === product.id
            ? { ...p, qty: p.qty + 1 }
            : p
        )
      }

      return [...prevCart, { ...product, qty: 1, selected: true }]
    })
  }

  // INCREASE QTY
  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(p =>
        p.id === id ? { ...p, qty: p.qty + 1 } : p
      )
    )
  }

  // DECREASE QTY
  const decreaseQty = (id) => {
    setCart(prev =>
      prev
        .map(p =>
          p.id === id ? { ...p, qty: p.qty - 1 } : p
        )
        .filter(p => p.qty > 0)
    )
  }

  // TOGGLE SELECT
  const toggleSelect = (id) => {
    setCart(prev =>
      prev.map(p =>
        p.id === id ? { ...p, selected: !p.selected } : p
      )
    )
  }

  // TOTAL PRICE (SELECTED ONLY)
  const total = cart
    .filter(p => p.selected)
    .reduce((sum, p) => sum + p.price * p.qty, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        toggleSelect,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
