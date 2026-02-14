'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-xl mb-10"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 opacity-95"></div>

      {/* Animated Glow */}
      <div className="absolute -inset-1 blur-2xl bg-purple-500 opacity-20 animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 p-8 text-white text-center">

        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-bold tracking-wide"
        >
          🚀 Upgrade Your Robotics Setup
        </motion.h2>

        <p className="mt-3 text-sm md:text-base text-purple-100">
          Premium Electronics • Fast Shipping • Trusted Components
        </p>

        <Link
          href="/category/sensors"
          className="inline-block mt-6 px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
        >
          Explore Now →
        </Link>

      </div>
    </motion.div>
  )
}
