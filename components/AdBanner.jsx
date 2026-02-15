'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const banners = [
  {
    title: '🚀 Upgrade Your Robotics Setup',
    subtitle: 'Premium Electronics • Fast Shipping • Trusted Components',
    link: '/category/sensors'
  },
  {
    title: '⚡ High Performance Drone Parts',
    subtitle: 'ESC • Propellers • Flight Controllers',
    link: '/category/drone-parts'
  },
  {
    title: '🔋 Power Your Projects',
    subtitle: 'Batteries • Power Modules • Smart Charging',
    link: '/category/power-modules'
  }
]

export default function AdBanner() {
  const [index, setIndex] = useState(0)

  // 🔥 Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % banners.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-xl mb-10">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 opacity-95"></div>
      <div className="absolute -inset-1 blur-2xl bg-purple-500 opacity-20 animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 p-8 text-white text-center min-h-[160px] flex flex-col justify-center">

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl font-bold tracking-wide">
              {banners[index].title}
            </h2>

            <p className="mt-2 text-sm md:text-base text-purple-100">
              {banners[index].subtitle}
            </p>

            <Link
              href={banners[index].link}
              className="inline-block mt-5 px-6 py-2 bg-white text-purple-700 font-semibold rounded-lg shadow-lg hover:scale-105 transition"
            >
              Explore →
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === index
                  ? 'bg-white'
                  : 'bg-purple-300 opacity-60'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
