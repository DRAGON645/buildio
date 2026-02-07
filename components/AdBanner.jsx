'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ads = [
  '/ads/ad1.png',
  '/ads/ad2.png',
  '/ads/ad3.png'
]

export default function AdBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-28 mb-6 overflow-hidden rounded-md border bg-white">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={ads[index]}
          alt="Advertisement"
          className="w-full h-28 object-cover"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>
    </div>
  )
}
