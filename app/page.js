'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import ProductCard from '@/components/ProductCard'
import AdBanner from '@/components/AdBanner'
import { useProducts } from '@/context/ProductContext'
import { useCategories } from '@/context/CategoryContext'
import Link from 'next/link'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { products } = useProducts()
  const { categories } = useCategories()

  const featuredProducts = products.filter(p => p.featured)

  const homeCategories = categories
    .filter(cat => cat.showOnHome)
    .slice(0, 8)

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="p-6 bg-gray-50 min-h-screen text-black">

        <AdBanner />

        {/* 🔥 CATEGORIES SECTION */}
        <div className="mb-8">

          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Categories
            </h2>

            {categories.filter(cat => cat.showOnHome).length > 8 && (
              <Link
                href="/categories"
                className="text-purple-700 text-sm font-semibold hover:underline"
              >
                View All →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {homeCategories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="relative h-20 rounded-lg overflow-hidden shadow-sm group transition"
              >

                <div className="absolute inset-0 bg-gradient-to-br from-purple-700 to-indigo-700" />

                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-25"
                  />
                )}

                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 flex items-center justify-center h-full">
                  <h3 className="text-white text-xs md:text-sm font-medium tracking-wide">
                    {cat.name}
                  </h3>
                </div>

              </Link>
            ))}
          </div>

        </div>

        {/* FEATURED PRODUCTS */}
        <h2 className="text-xl font-bold mb-4 text-black">
          Featured Products
        </h2>

        {featuredProducts.length === 0 ? (
          <p className="text-gray-500">
            No featured products
          </p>
        ) : (
          <div className="flex gap-6 flex-wrap">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </main>
    </>
  )
}
