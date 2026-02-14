'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCategories } from '@/context/CategoryContext'

export default function Sidebar({ open, onClose }) {
  const { categories } = useCategories()
  const [openCategory, setOpenCategory] = useState(null)

  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50
      transform transition-transform duration-300
      ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-bold text-lg">Categories</h2>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="p-4 space-y-2 overflow-y-auto h-full">

        {categories.map(cat => (
          <div key={cat.id}>

            {/* CATEGORY HEADER */}
            <div
              onClick={() =>
                setOpenCategory(openCategory === cat.id ? null : cat.id)
              }
              className="flex justify-between items-center cursor-pointer p-2 rounded hover:bg-gray-100"
            >
              <Link
                href={`/category/${cat.slug}`}
                className="font-medium"
              >
                {cat.name}
              </Link>

              {cat.subcategories?.length > 0 && (
                <span>
                  {openCategory === cat.id ? '▲' : '▼'}
                </span>
              )}
            </div>

            {/* SUBCATEGORIES */}
            {openCategory === cat.id &&
              cat.subcategories?.map((sub, index) => (
                <Link
                  key={index}
                  href={`/category/${cat.slug}/${sub.slug}`}
                  className="block ml-4 p-2 text-sm text-gray-600 hover:text-purple-700 hover:bg-gray-50 rounded transition"
                >
                  {sub.name}
                </Link>
              ))}
          </div>
        ))}

      </div>
    </div>
  )
}
