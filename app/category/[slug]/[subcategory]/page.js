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
  const [filterOpen, setFilterOpen] = useState(false)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [stockOnly, setStockOnly] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [maxPrice, setMaxPrice] = useState(5000)

  // 🔥 Find category
  const category = categories.find(
    c => c.slug?.toLowerCase() === slug?.toLowerCase()
  )

  // 🔥 Find subcategory
  const subcategoryObj = category?.subcategories?.find(
    s => s.slug?.toLowerCase() === decodedSubcategory?.toLowerCase()
  )

  // 🔥 Base filter
  let filteredProducts = products.filter(
    p =>
      p.category?.toLowerCase() === slug?.toLowerCase() &&
      p.subcategory?.toLowerCase() === decodedSubcategory?.toLowerCase()
  )

  // 🔍 Search filter
  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  // 💰 Price filter
  filteredProducts = filteredProducts.filter(p => p.price <= maxPrice)

  // 📦 Stock filter
  if (stockOnly) {
    filteredProducts = filteredProducts.filter(p => p.stock > 0)
  }

  // ⭐ Featured filter
  if (featuredOnly) {
    filteredProducts = filteredProducts.filter(p => p.featured)
  }

  // 💰 Sorting
  if (sort === 'low') {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price)
  }

  if (sort === 'high') {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price)
  }

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

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">

            <h1 className="text-2xl font-bold">
              {category.name} / {subcategoryObj.name}
            </h1>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition"
            >
              Filters
              <span
                className={`transition-transform duration-300 ${
                  filterOpen ? 'rotate-180' : 'rotate-0'
                }`}
              >
                ▼
              </span>
            </button>

          </div>

          {/* 🔽 FILTER PANEL */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              filterOpen ? 'max-h-96 mb-6' : 'max-h-0'
            }`}
          >
            <div className="bg-white border rounded-xl shadow p-5 flex flex-wrap gap-6 items-center">

              {/* Search */}
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg px-3 py-2 min-w-[200px] focus:ring-2 focus:ring-purple-500 outline-none"
              />

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Sort</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
              </select>

              {/* Price Slider */}
              <div className="flex flex-col min-w-[220px]">
                <label className="text-sm font-semibold mb-1">
                  Max Price: ₹{maxPrice}
                </label>

                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Stock */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={stockOnly}
                  onChange={(e) => setStockOnly(e.target.checked)}
                  className="accent-purple-600"
                />
                In Stock
              </label>

              {/* Featured */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                  className="accent-purple-600"
                />
                Featured
              </label>

            </div>
          </div>

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