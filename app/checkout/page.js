'use client'

import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import { useProducts } from '@/context/ProductContext'
import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function CheckoutPage() {
  const { cart, total } = useCart()
  const { reduceStock } = useProducts()

  const selectedItems = cart.filter(item => item.selected)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    message: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('cod')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ✅ REQUIRED FIELD VALIDATION
  const isFormValid =
    form.name.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.address.trim() !== '' &&
    form.pincode.trim() !== ''

  // 🔥 SAVE ORDER TO FIRESTORE
  const saveOrder = async (order) => {
    await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: Timestamp.now()
    })
  }

  // 💳 RAZORPAY PAYMENT
  const payWithRazorpay = () => {
    if (!window.Razorpay) {
      alert('Razorpay SDK not loaded')
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: 'INR',
      name: 'Buildio Store',
      description: 'Electronics Purchase',

      handler: async function (response) {
        try {
          const order = {
            orderId: 'ORD-' + Date.now(),
            customer: form,
            items: selectedItems,
            total,
            paymentMethod: 'razorpay',
            paymentId: response.razorpay_payment_id,
            status: 'PAID'
          }

          await saveOrder(order)
          await reduceStock(selectedItems)

          alert('Payment successful!')
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

  // 📦 PLACE ORDER HANDLER
  const placeOrder = async () => {
    if (!isFormValid) {
      alert('Please fill all required delivery details')
      return
    }

    // 🔥 RAZORPAY FLOW
    if (paymentMethod === 'razorpay') {
      payWithRazorpay()
      return
    }

    // 📦 COD / MANUAL UPI FLOW
    const order = {
      orderId: 'ORD-' + Date.now(),
      customer: form,
      items: selectedItems,
      total,
      paymentMethod,
      status:
        paymentMethod === 'cod'
          ? 'COD_PLACED'
          : 'PAYMENT_PENDING'
    }

    try {
      await saveOrder(order)
      await reduceStock(selectedItems)
      alert('Order placed successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to place order')
    }
  }

  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen text-black">
        <div className="max-w-6xl mx-auto p-6">

          <h1 className="text-2xl font-bold mb-6">
            Checkout
          </h1>

          {selectedItems.length === 0 ? (
            <p className="text-gray-500">
              No products selected for checkout.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">

              {/* LEFT – ADDRESS FORM */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="font-semibold mb-4">
                  Delivery Details
                </h2>

                <input
                  name="name"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mb-3 p-3 border rounded"
                />

                <input
                  name="phone"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full mb-3 p-3 border rounded"
                />

                <textarea
                  name="address"
                  placeholder="Full Address *"
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

                <textarea
                  name="message"
                  placeholder="Message (optional)"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />
              </div>

              {/* RIGHT – ORDER SUMMARY */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="font-semibold mb-4">
                  Order Summary
                </h2>

                {selectedItems.map(item => (
                  <div
                    key={item.id}
                    className="flex justify-between mb-2"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}

                <hr className="my-4" />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                {/* PAYMENT METHOD */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">
                    Payment Method
                  </h3>

                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    Cash on Delivery
                  </label>

                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    UPI (Manual)
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                    />
                    Razorpay (Online Payment)
                  </label>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 bg-gray-100 p-3 rounded text-sm">
                      <p><strong>UPI ID:</strong> yourupi@upi</p>
                      <p className="text-gray-600">
                        Pay and then place order
                      </p>
                    </div>
                  )}
                </div>

                {/* PLACE ORDER */}
                <button
                  disabled={!isFormValid}
                  onClick={placeOrder}
                  className={`mt-6 w-full py-3 rounded transition
                    ${!isFormValid
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-700 hover:bg-purple-800 text-white'
                    }`}
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
