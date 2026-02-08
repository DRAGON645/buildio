'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { db } from '@/lib/firebase'
import Barcode from 'react-barcode'
import {
  collection,
  orderBy,
  query,
  updateDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'

export default function AdminOrdersPage() {
  const { isAdmin, logout } = useAdminAuth()
  const router = useRouter()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const audioRef = useRef(null)
  const firstLoadRef = useRef(true)

  /* 🔐 Protect route */
  useEffect(() => {
    if (!isAdmin) {
      localStorage.setItem('adminRedirect', '/admin/orders')
      router.push('/admin/login')
    }
  }, [isAdmin, router])

  /* 🎨 STATUS COLOR HELPER */
  const getStatusColor = (status) => {
    switch (status) {
      case 'PLACED':
        return 'bg-yellow-100 text-yellow-800'
      case 'PACKED':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  /* 🔥 REALTIME ORDERS */
  useEffect(() => {
    if (!isAdmin) return

    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }))

        // 🔔 Play sound ONLY for new orders (not first load)
        if (!firstLoadRef.current && list.length > orders.length) {
          audioRef.current?.play()
        }

        setOrders(list)
        setLoading(false)
        firstLoadRef.current = false
      },
      (error) => {
        console.error('Realtime orders error:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [isAdmin, orders.length])

  /* 🔁 UPDATE ORDER STATUS */
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const ref = doc(db, 'orders', orderId)
      await updateDoc(ref, { status: newStatus })
    } catch (err) {
      console.error('Failed to update status', err)
      alert('Status update failed')
    }
  }

  /* 🖨 PRINT BILL */
  const printOrder = (orderId) => {
    const printContent = document.getElementById(`order-${orderId}`)
    const originalContent = document.body.innerHTML

    document.body.innerHTML = printContent.innerHTML
    window.print()
    document.body.innerHTML = originalContent
    window.location.reload()
  }

  if (!isAdmin) return null

  return (
    <main className="bg-gray-100 min-h-screen p-6 text-black">

      {/* 🔔 SOUND */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-3xl font-bold">Admin – Orders</h1>

        <button
          onClick={logout}
          className="text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded shadow mb-6">

            {/* PRINTABLE BILL */}
            <div
              id={`order-${order.orderId}`}
              className="max-w-xl mx-auto border p-6"
            >
              {/* STORE HEADER */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Build.io Electronics</h2>
                <p className="text-sm">Components & Robotics Store</p>
                <p className="text-xs">support@buildio.com</p>
              </div>

              <hr className="my-3" />

              {/* ORDER INFO */}
              <div className="flex justify-between text-sm mb-3">
                <div>
                  <p><strong>Order ID:</strong> {order.orderId}</p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {order.createdAt?.toDate().toLocaleString()}
                  </p>
                </div>

                <Barcode
                  value={order.orderId}
                  height={40}
                  width={1.2}
                  fontSize={12}
                />
              </div>

              <hr className="my-3" />

              {/* CUSTOMER INFO */}
              <div className="text-sm mb-4">
                <p className="font-semibold">Ship To:</p>
                <p>{order.customer.name}</p>
                <p>{order.customer.phone}</p>
                <p>{order.customer.address}</p>
                <p>Pincode: {order.customer.pincode}</p>
              </div>

              {/* ITEMS */}
              <table className="w-full text-sm border-collapse mb-4">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Item</th>
                    <th className="text-center py-1">Qty</th>
                    <th className="text-right py-1">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="py-1">{item.name}</td>
                      <td className="text-center py-1">{item.qty}</td>
                      <td className="text-right py-1">
                        ₹{item.price * item.qty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TOTAL */}
              <div className="flex justify-between font-bold text-sm mb-2">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>

              {/* 🔥 STATUS (ADMIN ONLY, NO PRINT) */}
              <div className="mt-3 print:hidden">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className="p-2 border rounded text-sm"
                  >
                    <option value="PLACED">Placed</option>
                    <option value="PACKED">Packed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>
              </div>

              <p className="text-sm mt-2">
                <strong>Payment:</strong> {order.paymentMethod}
              </p>

              {order.customer.message && (
                <p className="text-sm mt-2">
                  <strong>Customer Note:</strong> {order.customer.message}
                </p>
              )}

              <hr className="my-3" />

              <p className="text-center text-xs">
                Thank you for shopping with us!
              </p>
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex justify-end print:hidden">
              <button
                onClick={() => printOrder(order.orderId)}
                className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
              >
                Print Bill
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  )
}
