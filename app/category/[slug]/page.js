'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCategories } from '@/context/CategoryContext'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function CategoryPage() {
  const { slug } = useParams()
  const { categories } = useCategories()
  const router = useRouter()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const category = categories.find(c => c.slug === slug)

  if (!category) {
    return (
      <>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="p-6 text-black">Category not found</main>
      </>
    )
  }

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="bg-gray-50 min-h-screen p-6 text-black">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-2xl font-bold mb-6">
            {category.name}
          </h1>

          {category.subcategories?.length === 0 ? (
            <p>No subcategories available.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              {category.subcategories.map(sub => (
                <div
                  key={sub.slug}
                  onClick={() =>
                    router.push(`/category/${category.slug}/${sub.slug}`)
                  }
                  className="cursor-pointer relative rounded-lg overflow-hidden shadow hover:scale-105 transition"
                >
                  {sub.image ? (
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      No Image
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h2 className="text-white font-semibold text-lg">
                      {sub.name}
                    </h2>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </main>
    </>
  )
}
