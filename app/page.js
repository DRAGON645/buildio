'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import AdBanner from '@/components/AdBanner'
import { useProducts } from '@/context/ProductContext'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'


export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { products } = useProducts()

  const featuredProducts = products.filter(p => p.featured)

  const testFirebase = async () => {
  try {
    await addDoc(collection(db, 'test'), {
      message: 'Firebase connected',
      createdAt: new Date()
    })
    alert('Firebase connected successfully!')
  } catch (err) {
    console.error(err)
    alert('Firebase connection failed')
  }
}






  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="p-6 bg-gray-50 min-h-screen text-black">

        {/* AD BANNER */}
        <AdBanner />

        {/* CATEGORIES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            'Sensors',
            'Motors',
            'Batteries',
            'Displays',
            'Controllers',
            'Power Modules'
          ].map(cat => (
            <CategoryCard key={cat} name={cat} />
          ))}
        </div>



        <button
  onClick={testFirebase}
  className="mb-4 bg-black text-white px-4 py-2 rounded"
>
  Test Firebase
</button>


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
