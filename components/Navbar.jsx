'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function Navbar({ onMenuClick }) {
  const { cart } = useCart()

  const itemCount = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  )

  return (
    <nav className="bg-purple-700 text-white px-6 py-4 flex justify-between items-center">
      
      <button onClick={onMenuClick}>☰</button>
      

      <div className="flex gap-6 items-center">
        <Link href="/">Home</Link>
        <Link href="/cart" className="relative">
          🛒 My Cart
          {itemCount > 0 && (
            <span
              className="absolute -top-2 -right-3 bg-red-600
                         text-xs px-2 py-0.5 rounded-full"
            >
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
