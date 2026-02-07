'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const categories = [
  { name: 'Sensors', slug: 'sensors' },
  { name: 'Motors', slug: 'motors' },
  { name: 'Batteries', slug: 'batteries' },
  { name: 'Displays', slug: 'displays' },
  { name: 'Controllers', slug: 'controllers' },
  { name: 'Power Modules', slug: 'power-modules' }
]

export default function Sidebar({ open, onClose }) {
  const router = useRouter()

  if (!open) return null

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg"
      >
        <div className="p-4 border-b font-semibold flex justify-between">
          Categories
          <button onClick={onClose}>✕</button>
        </div>

        <ul className="p-4 space-y-3">
          {categories.map(cat => (
            <li
              key={cat.slug}
              onClick={() => {
                router.push(`/category/${cat.slug}`)
                onClose()
              }}
              className="cursor-pointer text-gray-800 hover:text-purple-700 transition"
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  )
}
