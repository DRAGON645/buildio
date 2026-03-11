'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useBanners } from '@/context/BannerContext'

export default function AdBanner() {
  const { banners } = useBanners()
  const activeBanners = banners.filter(b => b.active)

  const [current, setCurrent] = useState(0)
  const [progressKey, setProgressKey] = useState(0)

  const nextSlide = () => {
    setCurrent(prev => (prev + 1) % activeBanners.length)
    setProgressKey(prev => prev + 1)
  }

  const prevSlide = () => {
    setCurrent(prev =>
      prev === 0 ? activeBanners.length - 1 : prev - 1
    )
    setProgressKey(prev => prev + 1)
  }

  useEffect(() => {
    if (activeBanners.length === 0) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [activeBanners])

  if (activeBanners.length === 0) return null

  return (
    <div className="relative h-56 md:h-72 rounded-xl overflow-hidden mb-9 shadow-lg">

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Link href={activeBanners[current].link}>
            <motion.img
              src={activeBanners[current].image}
              alt="Banner"
              initial={{ scale: 1 }}
              animate={{ scale: 1.12 }}
              transition={{ duration: 5, ease: 'linear' }}
              className="w-full h-full object-cover cursor-pointer"
            />
          </Link>

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4 pointer-events-none">
            <h2 className="text-white text-xl md:text-3xl font-bold mb-2">
              {activeBanners[current].title}
            </h2>

            <p className="text-gray-200 text-sm md:text-base mb-4">
              {activeBanners[current].subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
      >
        <ChevronRight size={20} />
      </button>

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
