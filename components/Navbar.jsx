'use client'

import { useCart } from '@/context/CartContext'
import { useProducts } from '@/context/ProductContext'
import { useCategories } from '@/context/CategoryContext'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar({ onMenuClick }) {
  const { cart } = useCart()
  const { products } = useProducts()
  const { categories } = useCategories()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)

  const query = search.toLowerCase()

  // 🔍 PRODUCTS
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(query)
  )

  // 📁 CATEGORIES + SUBCATEGORIES
  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(query)
  )

  const filteredSubcategories = categories.flatMap(c =>
    c.subcategories
      ?.filter(sub =>
        sub.name.toLowerCase().includes(query)
      )
      .map(sub => ({
        ...sub,
        categorySlug: c.slug
      })) || []
  )

  // ✨ Highlight function
  const highlight = (text) => {
    const index = text.toLowerCase().indexOf(query)
    if (index === -1) return text

    return (
      <>
        {text.substring(0, index)}
        <span className="bg-yellow-200">
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-purple-700 text-white px-6 py-3 flex justify-between items-center shadow">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-xl px-2 py-1 rounded hover:bg-white hover:text-purple-700 transition"
        >
          ☰
        </button>

        <Link
          href="/"
          className="font-bold text-lg px-2 py-1 rounded hover:bg-white hover:text-purple-700 transition"
        >
          Buildio
        </Link>
      </div>

      {/* 🔍 SEARCH */}
      <div className="relative w-1/3 hidden md:block">

        <input
          type="text"
          placeholder="Search products, categories..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setShowResults(true)
          }}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onFocus={() => search && setShowResults(true)}
          className="w-full px-4 py-2 rounded-lg text-black outline-none"
        />

        {/* DROPDOWN */}
        {showResults && search && (
          <div className="absolute top-full left-0 w-full bg-white text-black rounded-xl shadow-lg mt-2 max-h-80 overflow-y-auto z-50">

            {/* PRODUCTS */}
            {filteredProducts.length > 0 && (
              <div>
                <p className="px-4 py-2 text-xs text-gray-500 font-semibold">
                  PRODUCTS
                </p>

                {filteredProducts.slice(0, 5).map(p => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/product/${p.id}`)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-8 w-8 object-contain"
                    />

                    <span className="text-sm">
                      {highlight(p.name)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* CATEGORIES */}
            {filteredCategories.length > 0 && (
              <div>
                <p className="px-4 py-2 text-xs text-gray-500 font-semibold">
                  CATEGORIES
                </p>

                {filteredCategories.slice(0, 3).map(c => (
                  <div
                    key={c.id}
                    onClick={() => router.push(`/category/${c.slug}`)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium"
                  >
                    📁 {highlight(c.name)}
                  </div>
                ))}
              </div>
            )}

            {/* SUBCATEGORIES */}
            {filteredSubcategories.length > 0 && (
              <div>
                <p className="px-4 py-2 text-xs text-gray-500 font-semibold">
                  SUBCATEGORIES
                </p>

                {filteredSubcategories.slice(0, 3).map((sub, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      router.push(`/category/${sub.categorySlug}/${sub.slug}`)
                    }
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    📂 {highlight(sub.name)}
                  </div>
                ))}
              </div>
            )}

            {/* VIEW ALL */}
            <div
              onClick={() => router.push(`/search?q=${search}`)}
              className="px-4 py-3 text-center text-purple-700 font-semibold hover:bg-gray-100 cursor-pointer border-t"
            >
              View all results →
            </div>

            {/* EMPTY */}
            {filteredProducts.length === 0 &&
              filteredCategories.length === 0 &&
              filteredSubcategories.length === 0 && (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  No results found
                </div>
              )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 text-sm font-medium">

        <Link
          href="/"
          className="px-3 py-1 rounded hover:bg-white hover:text-purple-700 transition"
        >
          Home
        </Link>

        <Link
          href="/order-tracking"
          className="px-3 py-1 rounded hover:bg-white hover:text-purple-700 transition"
        >
          Track Order
        </Link>

        <Link
          href="/orders"
          className="px-3 py-1 rounded hover:bg-white hover:text-purple-700 transition"
        >
          My Orders
        </Link>

        <Link
          href="/cart"
          className="relative px-3 py-1 rounded hover:bg-white hover:text-purple-700 transition flex items-center gap-1"
        >
          🛒 Cart

          {itemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-white text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {itemCount}
            </span>
          )}
        </Link>

      </div>
    </nav>
  )
}