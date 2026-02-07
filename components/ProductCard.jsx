'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function ProductCard({ product }) {
  const router = useRouter()
  const { addToCart } = useCart()

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-lg shadow p-4 w-64 text-black"
    >
      <img
        src={product.image}
        alt={product.name}
        onClick={() => router.push(`/product/${product.id}`)}
        className="h-32 mx-auto object-contain cursor-pointer"
      />

      <h3
        onClick={() => router.push(`/product/${product.id}`)}
        className="mt-3 font-semibold text-sm cursor-pointer hover:text-purple-700"
      >
        {product.name}
      </h3>

      <p className="text-purple-700 font-bold mt-1">
        ₹{product.price}
      </p>

      {product.stock === 0 ? (
        <button
          disabled
          className="mt-3 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed"
        >
          Out of Stock
        </button>
      ) : (
        <button
          onClick={() => addToCart(product)}
          className="mt-3 w-full bg-purple-700 text-white py-2 rounded
                     hover:bg-purple-800 transition"
        >
          Add to Cart
        </button>
      )}
    </motion.div>
  )
}
