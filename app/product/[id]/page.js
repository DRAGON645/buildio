'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useProducts } from '@/context/ProductContext'
import { useCart } from '@/context/CartContext'
import { useParams } from 'next/navigation'

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
        <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">

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

              <p className="text-purple-700 font-bold text-xl mb-4">
                ₹{product.price}
              </p>

              {product.stock === 0 && (
                <p className="text-red-600 font-semibold mb-2">
                  Out of Stock
                </p>
              )}

              <button
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
                className={`px-6 py-3 rounded text-white
                  ${product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-700 hover:bg-purple-800'
                  }`}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* SPECS */}
          {product.specs?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">
                Specifications
              </h2>
              <ul className="list-disc ml-6">
                {product.specs.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* DESCRIPTION */}
          {product.description && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">
                Description
              </h2>
              <p>{product.description}</p>
            </div>
          )}

        </div>
      </main>
    </>
  )
}
