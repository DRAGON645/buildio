'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useProducts } from '@/context/ProductContext'
import { useCart } from '@/context/CartContext'
import { useParams } from 'next/navigation'
import RatingStars from '@/components/RatingStars'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { products } = useProducts()
  const { addToCart } = useCart()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const product = products.find(p => String(p.id) === id)

  if (!product) {
    return (
      <>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="p-6">Product not found</main>
      </>
    )
  }

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="bg-gray-50 min-h-screen p-6 text-black">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">

          <div className="grid md:grid-cols-2 gap-8">

            {/* IMAGE */}
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-contain"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400">
                No Image Available
              </div>
            )}

            {/* DETAILS */}
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {product.name}
              </h1>

              {/* ⭐ Rating */}
              <div className="mb-2">
                <RatingStars rating={product.rating || 0} />
              </div>

              <p className="text-purple-700 font-bold text-xl mb-4">
                ₹{product.price}
              </p>

              {product.stock === 0 ? (
                <p className="text-red-600 font-semibold mb-2">
                  Out of Stock
                </p>
              ) : (
                <p className="text-green-600 font-medium mb-2">
                  In Stock ({product.stock})
                </p>
              )}

              <button
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
                className={`px-6 py-3 rounded-lg text-white transition ${
                  product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-700 hover:bg-purple-800'
                }`}
              >
                Add to Cart
              </button>
            </div>

          </div>

          {/* 🔥 SPECIFICATIONS (CLEAN UI) */}
          {product.specs?.length > 0 && (
            <div className="mt-10">

              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Specifications
              </h2>

              <div className="bg-white border rounded-xl shadow-sm divide-y">

                {product.specs.map((spec, index) => {
                  const [key, value] = spec.split(':')

                  return (
                    <div
                      key={index}
                      className="flex justify-between px-4 py-3 text-sm hover:bg-gray-50 transition"
                    >
                      <span className="text-gray-600 font-medium">
                        {key}
                      </span>

                      <span className="text-gray-900 font-semibold text-right">
                        {value}
                      </span>
                    </div>
                  )
                })}

              </div>

            </div>
          )}

          {/* DESCRIPTION */}
          {product.description && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

        </div>
      </main>
    </>
  )
}