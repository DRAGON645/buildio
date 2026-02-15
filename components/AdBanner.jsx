'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const banners = [
  {
    id: 1,
    title: 'Premium Robotics Components',
    subtitle: 'High quality sensors & modules',
    image: '/banner1.jpg',
    link: '/category/sensors'
  },
  {
    id: 2,
    title: 'Advanced Drone Parts',
    subtitle: 'ESC, Motors & Propellers',
    image: '/banner2.jpg',
    link: '/category/drone-parts'
  },
  {
    id: 3,
    title: 'Power & Control Systems',
    subtitle: 'Reliable & Industrial Grade',
    image: '/banner3.jpg',
    link: '/category/controllers'
  }
]

export default function AdBanner() {
  const [current, setCurrent] = useState(0)
  const [progressKey, setProgressKey] = useState(0)

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length)
    setProgressKey(prev => prev + 1)
  }

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    )
    setProgressKey(prev => prev + 1)
  }

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-56 md:h-72 rounded-xl overflow-hidden mb-8 shadow-lg">

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <motion.img
  src={banners[current].image}
  alt="Banner"
  initial={{ scale: 1 }}
  animate={{ scale: 1.12 }}
  transition={{ duration: 5, ease: 'linear' }}
  className="w-full h-full object-cover"
/>

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
            <h2 className="text-white text-xl md:text-3xl font-bold mb-2">
              {banners[current].title}
            </h2>

            <p className="text-gray-200 text-sm md:text-base mb-4">
              {banners[current].subtitle}
            </p>

            <Link
              href={banners[current].link}
              className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded transition"
            >
              Explore Now
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* LEFT BUTTON */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
      >
        <ChevronLeft size={20} />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
      >
        <ChevronRight size={20} />
      </button>

      {/* 🔥 BOTTOM PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <motion.div
          key={progressKey}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-purple-600"
        />
      </div>

    </div>
  )
}
