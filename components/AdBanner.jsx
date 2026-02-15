'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const banners = [
  {
    title: 'Upgrade Your Robotics Setup',
    subtitle: 'Premium Sensors & Smart Components',
    link: '/category/sensors',
    image: '/unnamed3.jpg'
  },
  {
    title: 'High Performance Drone Parts',
    subtitle: 'ESC • Propellers • Flight Controllers',
    link: '/category/drone-parts',
    image: '/unnamed.jpg'
  },
  {
    title: 'Power Your Innovation',
    subtitle: 'Batteries • Power Modules • Controllers',
    link: '/category/power-modules',
    image: '/unnamed2.jpg'
  }
]

export default function AdBanner() {
  const [index, setIndex] = useState(0)

  // 🔥 Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[220px] md:h-[300px] rounded-xl overflow-hidden mb-10">

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <img
            src={banners[index].image}
            alt="Banner"
            className="w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/55"></div>

          {/* Purple Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700/40 to-indigo-700/40"></div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
            <h2 className="text-xl md:text-3xl font-bold">
              {banners[index].title}
            </h2>

            <p className="mt-2 text-sm md:text-lg text-gray-200">
              {banners[index].subtitle}
            </p>

            <Link
              href={banners[index].link}
              className="mt-5 px-6 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg font-semibold transition"
            >
              Explore →
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === index
                ? 'bg-white'
                : 'bg-white/40'
            }`}
          />
        ))}
      </div>

    </div>
  )
}
