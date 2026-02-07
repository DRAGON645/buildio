'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'

export default function AdminLoginPage() {
  const { login } = useAdminAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Email and password required')
      return
    }

    try {
      setLoading(true)
      await login(email, password)

      const redirect =
        localStorage.getItem('adminRedirect') || '/admin/products'

      localStorage.removeItem('adminRedirect')
      router.push(redirect)
    } catch (err) {
      console.error(err)
      alert('Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4 text-center">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border rounded mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-700 text-white py-3 rounded
                     hover:bg-purple-800 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </main>
  )
}
