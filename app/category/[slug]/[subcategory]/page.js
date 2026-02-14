'use client'

import { useParams } from 'next/navigation'
import { useProducts } from '@/context/ProductContext'
import { useCategories } from '@/context/CategoryContext'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import ProductCard from '@/components/ProductCard'
import { useState } from 'react'

export default function SubcategoryPage() {
  const { slug, subcategory } = useParams()
  const decodedSubcategory = decodeURIComponent(subcategory)
  const { products } = useProducts()
  const { categories } = useCategories()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 🔥 Find category
  const category = categories.find(
    c => c.slug?.toLowerCase() === slug?.toLowerCase()
  )

  // 🔥 Find subcategory object
  const subcategoryObj = category?.subcategories?.find(
    s => s.slug?.toLowerCase() === decodedSubcategory?.toLowerCase()
  )

  // 🔥 Filter products
  const filteredProducts = products.filter(
    p =>
      p.category?.toLowerCase() === slug?.toLowerCase() &&
      p.subcategory?.toLowerCase() === decodedSubcategory?.toLowerCase()
  )

  if (!category || !subcategoryObj) {
    return (
      <>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="p-6 text-black">
          Subcategory not found
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="bg-gray-50 min-h-screen p-6 text-black">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-2xl font-bold mb-2">
            {category.name} / {subcategoryObj.name}
          </h1>

          <p className="text-gray-600 mb-6">
            {filteredProducts.length} Products
          </p>

          {filteredProducts.length === 0 ? (
            <p>No products available in this subcategory.</p>
          ) : (
            <div className="flex gap-6 flex-wrap">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  )
}
