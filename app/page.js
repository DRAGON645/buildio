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

  // 🔥 Show only 8 categories on home
  const homeCategories = categories
    .filter(cat => cat.showOnHome)
    .slice(0, 8)

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="p-6 bg-gray-50 min-h-screen text-black">

        {/* AD BANNER */}
        <AdBanner />

        {/* 🔥 DYNAMIC CATEGORIES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {homeCategories.map(cat => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white p-4 rounded shadow hover:shadow-md transition text-center"
            >
              <p className="font-semibold">{cat.name}</p>
            </Link>
          ))}
        </div>

        {/* View All if more than 8 */}
        {categories.filter(cat => cat.showOnHome).length > 8 && (
          <div className="text-center mb-8">
            <Link
              href="/categories"
              className="text-purple-700 font-semibold hover:underline"
            >
              View All Categories →
            </Link>
          </div>
        )}

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
