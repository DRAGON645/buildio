'use client'

import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import { useProducts } from '@/context/ProductContext'
import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart()
  const { reduceStock } = useProducts()
  const router = useRouter()

  const selectedItems = cart.filter(item => item.selected)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    country: 'India',
    message: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [copied, setCopied] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'phone' && !/^\d*$/.test(value)) return
    if (name === 'pincode' && !/^\d*$/.test(value)) return

    setForm({ ...form, [name]: value })
  }

  const isFormValid =
    form.name.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.address.trim() !== '' &&
    form.pincode.trim() !== ''

  const saveOrder = async (order) => {
    await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: Timestamp.now()
    })
  }

  // 🎉 SUCCESS HANDLER
  const handleSuccess = (generatedId) => {
    setOrderId(generatedId)
    setShowSuccess(true)
    clearCart?.()

    setTimeout(() => {
      router.push('/')
    }, 3000)
  }

  // 📋 COPY ORDER ID
  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // 💳 RAZORPAY
  const payWithRazorpay = () => {
    if (!window.Razorpay) {
      alert('Razorpay SDK not loaded')
      return
    }

    const generatedId = 'ORD-' + Date.now()

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: 'INR',
      name: 'Buildio Store',
      description: 'Electronics Purchase',

      handler: async function (response) {
        try {
          const order = {
            orderId: generatedId,
            customer: form,
            items: selectedItems,
            total,
            paymentMethod: 'razorpay',
            paymentId: response.razorpay_payment_id,
            status: 'PAID'
          }

          await saveOrder(order)
          await reduceStock(selectedItems)

          handleSuccess(generatedId)
        } catch (err) {
          console.error(err)
          alert('Payment succeeded but order saving failed')
        }
      },

      prefill: {
        name: form.name,
        contact: form.phone
      },

      theme: {
        color: '#6b21a8'
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  // 📦 PLACE ORDER
  const placeOrder = async () => {
    if (!isFormValid) {
      alert('Please fill all required delivery details')
      return
    }

    const generatedId = 'ORD-' + Date.now()

    if (paymentMethod === 'razorpay') {
      payWithRazorpay()
      return
    }

    const order = {
      orderId: generatedId,
      customer: form,
      items: selectedItems,
      total,
      paymentMethod,
      status: 'COD_PLACED'
    }

    try {
      await saveOrder(order)
      await reduceStock(selectedItems)

      handleSuccess(generatedId)
    } catch (err) {
      console.error(err)
      alert('Failed to place order')
    }
  }

  return (
    <>
      <Navbar />

      {/* 🎉 SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl text-center shadow-lg w-80">

            <h2 className="text-xl font-bold text-green-600 mb-2">
              ✅ Order Placed!
            </h2>

            <p className="text-gray-600 mb-3">
              Your Order ID:
            </p>

            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                {orderId}
              </span>

              <button
                onClick={copyOrderId}
                className="text-sm bg-purple-700 text-white px-2 py-1 rounded hover:bg-purple-800"
              >
                Copy
              </button>
            </div>

            {copied && (
              <p className="text-green-600 text-sm mb-2">
                Copied!
              </p>
            )}

            <p className="text-gray-500 text-sm">
              Redirecting to home...
            </p>

          </div>
        </div>
      )}

      <main className="bg-gray-50 min-h-screen text-black">
        <div className="max-w-6xl mx-auto p-6">

          <h1 className="text-2xl font-bold mb-6">
            Checkout
          </h1>

          {selectedItems.length === 0 ? (
            <p>No products selected.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">

              {/* LEFT */}
              <div className="bg-white p-6 rounded-lg shadow">

                <input
                  name="name"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mb-3 p-3 border rounded"
                />

                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full mb-3 p-3 border rounded"
                >
                  <option>India</option>
                  <option>UAE</option>
                  <option>USA</option>
                </select>

                <input
                  name="phone"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full mb-3 p-3 border rounded"
                />

                <textarea
                  name="address"
                  placeholder="Address *"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full mb-3 p-3 border rounded"
                />

                <input
                  name="pincode"
                  placeholder="Pincode *"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full mb-3 p-3 border rounded"
                />

              </div>

              {/* RIGHT */}
              <div className="bg-white p-6 rounded-lg shadow">

                <div className="flex justify-between font-bold mb-4">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <label className="block mb-2">
                  <input
                    type="radio"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  /> COD
                </label>

                <label className="block mb-4">
                  <input
                    type="radio"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                  /> Razorpay
                </label>

                <button
                  onClick={placeOrder}
                  disabled={!isFormValid}
                  className="w-full bg-purple-700 text-white py-3 rounded hover:bg-purple-800"
                >
                  Place Order
                </button>

              </div>

            </div>
          )}

        </div>
      </main>
    </>
  )
}