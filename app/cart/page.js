'use client'

import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const router = useRouter()

  const {
    cart,
    increaseQty,
    decreaseQty,
    toggleSelect,
    total
  } = useCart()

  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto p-6">

          <h1 className="text-2xl font-bold mb-6">
            My Cart
          </h1>

          {cart.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty.
            </p>
          ) : (
            <>
              {/* CART ITEMS */}
              <div className="space-y-4">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow
                               flex items-center justify-between"
                  >
                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleSelect(item.id)}
                      />

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 object-contain"
                      />

                      <div>
                        <h3 className="font-semibold text-black">
                          {item.name}
                        </h3>
                        <p className="text-purple-700 font-bold">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-3 py-1 border rounded text-black"
                      >
                        −
                      </button>

                      <span className="font-semibold text-black">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-3 py-1 border rounded text-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="mt-6 bg-white p-4 rounded-lg shadow
                              flex justify-between items-center">
                <span className="font-semibold text-black">
                  Total
                </span>
                <span className="font-bold text-purple-700 text-lg">
                  ₹{total}
                </span>
              </div>

              {/* CHECKOUT BUTTON (FIXED) */}
              <div className="mt-4 text-right">
                <button
                  disabled={total === 0}
                  onClick={() => router.push('/checkout')}
                  className={`px-6 py-3 rounded transition
                    ${total === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-700 hover:bg-purple-800 text-white'
                    }`}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}

        </div>
      </main>
    </>
  )
}
