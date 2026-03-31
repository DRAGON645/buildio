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

  useEffect(() => {
    if (!isAdmin) {
      localStorage.setItem('adminRedirect', '/admin/orders')
      router.push('/admin/login')
    }
  }, [isAdmin, router])

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLACED': return 'bg-yellow-100 text-yellow-800'
      case 'PACKED': return 'bg-blue-100 text-blue-800'
      case 'SHIPPED': return 'bg-purple-100 text-purple-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    if (!isAdmin) return

    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))

      if (!firstLoadRef.current && list.length > orders.length) {
        audioRef.current?.play()
      }

      setOrders(list)
      setLoading(false)
      firstLoadRef.current = false
    })

    return () => unsubscribe()
  }, [isAdmin, orders.length])

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const ref = doc(db, 'orders', orderId)
      await updateDoc(ref, { status: newStatus })
    } catch (err) {
      console.error('Failed to update status', err)
      alert('Status update failed')
    }
  }

  const printOrder = (orderId) => {
    const printContent = document.getElementById(`order-${orderId}`)
    const originalContent = document.body.innerHTML

    document.body.innerHTML = printContent.innerHTML
    window.print()
    document.body.innerHTML = originalContent
    window.location.reload()
  }

  // 📲 WhatsApp Message Function
  const sendWhatsApp = (order) => {
    const message = `Hello 👋

Your order has been confirmed!

🧾 Order ID: ${order.orderId}
💰 Total: ₹${order.total}

We will process it soon 🚀`

    const phone = order.customer.phone.replace(/\D/g, '')
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // 📅 Group Orders by Date
  const groupOrders = () => {
    const groups = { today: [], yesterday: [], older: [] }

    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    orders.forEach(order => {
      const date = order.createdAt?.toDate()
      if (!date) return

      if (date.toDateString() === today.toDateString()) {
        groups.today.push(order)
      } else if (date.toDateString() === yesterday.toDateString()) {
        groups.yesterday.push(order)
      } else {
        groups.older.push(order)
      }
    })

    return groups
  }

  if (!isAdmin) return null

  const grouped = groupOrders()

  const renderOrders = (list) => (
    list.map(order => (
      <div key={order.id} className="bg-white p-6 rounded shadow mb-6">

        <div id={`order-${order.orderId}`} className="max-w-xl mx-auto border p-6">

          <div className="text-center mb-2">
            <p className="text-xs text-gray-500">
              Ordered from Buildio Store
            </p>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-sm mb-3">
            <div>
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Date:</strong> {order.createdAt?.toDate().toLocaleString()}</p>
            </div>

            <Barcode value={order.orderId} height={40} width={1.2} fontSize={12} />
          </div>

          <hr className="my-3" />

          <div className="text-sm mb-4">
            <p className="font-semibold">Ship To:</p>
            <p>{order.customer.name}</p>
            <p>{order.customer.phone}</p>
            <p>{order.customer.address}</p>
            <p>Pincode: {order.customer.pincode}</p>
          </div>

          <table className="w-full text-sm border-collapse mb-4">
            <tbody>
              {order.items.map(item => (
                <tr key={item.id} className="border-b">
                  <td>{item.name}</td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-right">₹{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between font-bold text-sm mb-2">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>

          <div className="mt-3 print:hidden flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
              {order.status}
            </span>

            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
              className="p-2 border rounded text-sm"
            >
              <option value="PLACED">Placed</option>
              <option value="PACKED">Packed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          <p className="text-sm mt-2">
            <strong>Payment:</strong> {order.paymentMethod}
          </p>

          <hr className="my-3" />

          <p className="text-center text-xs">
            Thank you for shopping with us!
          </p>
        </div>

        <div className="mt-4 flex justify-end gap-3 print:hidden">
          <button
            onClick={() => sendWhatsApp(order)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            📲 Message Customer
          </button>

          <button
            onClick={() => printOrder(order.orderId)}
            className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
          >
            Print Bill
          </button>
        </div>
      </div>
    ))
  )

  return (
    <main className="bg-gray-100 min-h-screen p-6 text-black">

      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-3xl font-bold">Admin – Orders</h1>
        <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {grouped.today.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-3">📅 Today</h2>
              {renderOrders(grouped.today)}
            </>
          )}

          {grouped.yesterday.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-3">📅 Yesterday</h2>
              {renderOrders(grouped.yesterday)}
            </>
          )}

          {grouped.older.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-3">📅 Older</h2>
              {renderOrders(grouped.older)}
            </>
          )}
        </>
      )}
    </main>
  )
}