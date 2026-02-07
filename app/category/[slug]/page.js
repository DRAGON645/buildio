'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import ProductCard from '@/components/ProductCard'
import { useProducts } from '@/context/ProductContext'

export default function CategoryPage() {
  const { slug } = useParams()
  const { products } = useProducts()

  // ✅ SIDEBAR STATE (MISSING EARLIER)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredProducts = products.filter(
    p => p.category === slug
  )

  return (
    <>
      {/* NAVBAR WITH MENU CLICK */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="p-6 bg-gray-50 min-h-screen text-black">
        <h1 className="text-3xl font-bold mb-6 capitalize text-gray-900">
          {slug}
        </h1>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">
            No products found in this category.
          </p>
        ) : (
          <div className="flex gap-6 flex-wrap">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
