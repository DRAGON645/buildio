'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function CategoryCard({ name }) {
  const router = useRouter()

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={() => router.push(`/category/${name.toLowerCase()}`)}
      className="bg-white shadow rounded-lg p-4 text-center cursor-pointer"
    >
      <div className="h-16 flex items-center justify-center text-purple-700 font-bold">
        {name}
      </div>
    </motion.div>
  )
}
