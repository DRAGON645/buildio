'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function CategoryCard({ category }) {
  const router = useRouter()

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 200 }}
      onClick={() => router.push(`/category/${category.slug}`)}
      className="
        relative
        h-32
        rounded-xl
        overflow-hidden
        cursor-pointer
        shadow-lg
        group
        bg-gradient-to-br
        from-purple-700
        to-indigo-700
      "
    >

      {/* Background Image */}
      {category.image && (
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />

      {/* Text */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h3 className="text-white text-lg font-semibold tracking-wide uppercase">
          {category.name}
        </h3>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-xl border border-purple-400 opacity-0 group-hover:opacity-100 transition duration-300" />

    </motion.div>
  )
}
