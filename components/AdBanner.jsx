'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const banners = [
  {
    title: 'Premium Robotics Components',
    subtitle: 'High performance parts for your next build',
    image: '/banner1.jpg',
    link: '/category/sensors'
  },
  {
    title: 'Drone & Flight Systems',
    subtitle: 'ESC, Propellers & Flight Controllers',
    image: '/banner2.jpg',
    link: '/category/drone-parts'
  },
  {
    title: 'Smart Power Solutions',
    subtitle: 'Reliable batteries & power modules',
    image: '/banner3.jpg',
    link: '/category/power-modules'
  }
]

export default function AdBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () =>
    setIndex(prev => (prev + 1) % banners.length)

  const prevSlide = () =>
    setIndex(prev =>
      prev === 0 ? banners.length - 1 : prev - 1
    )

  return (
    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-10 shadow-lg">

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* 🔥 Background Image with Subtle Zoom */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 6, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={banners[index].image}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Text Content */}
          <div className="relative z-10 h-full flex flex-col justify-center items-start px-8 text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">
              {banners[index].title}
            </h2>

            <p className="text-sm md:text-lg mb-4 opacity-90">
              {banners[index].subtitle}
            </p>

            <Link
              href={banners[index].link}
              className="bg-purple-700 px-5 py-2 rounded hover:bg-purple-800 transition"
            >
              Explore Now
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white z-20"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white z-20"
      >
        <ChevronRight size={20} />
      </button>

    </div>
  )
}
