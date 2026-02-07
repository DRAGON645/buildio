'use client'

import { useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Navbar from '@/components/Navbar'

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const trackOrder = async () => {
    if (!orderId || !phone) {
      alert('Please enter Order ID and Phone number')
      return
    }

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const q = query(
        collection(db, 'orders'),
        where('orderId', '==', orderId),
        where('customer.phone', '==', phone)
      )

      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        setError('No order found with given details')
      } else {
        setOrder(snapshot.docs[0].data())
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 p-6 text-black">
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Track Your Order
          </h1>

          {/* INPUTS */}
          <input
            placeholder="Order ID"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            className="w-full p-3 border rounded mb-3"
          />

          <input
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full p-3 border rounded mb-4"
          />

          <button
            onClick={trackOrder}
            disabled={loading}
            className="w-full bg-purple-700 text-white py-3 rounded
                       hover:bg-purple-800 transition"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>

          {/* ERROR */}
          {error && (
            <p className="text-red-600 mt-4 text-center">
              {error}
            </p>
          )}

          {/* ORDER DETAILS */}
          {order && (
            <div className="mt-6 border-t pt-4">
              <h2 className="font-semibold mb-2">
                Order Details
              </h2>

              <p className="text-sm mb-1">
                <strong>Status:</strong> {order.status}
              </p>

              <p className="text-sm mb-1">
                <strong>Payment:</strong> {order.paymentMethod}
              </p>

              <hr className="my-3" />

              {order.items.map(item => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm mb-1"
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}

              <hr className="my-3" />

              <p className="font-bold text-right">
                Total: ₹{order.total}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
