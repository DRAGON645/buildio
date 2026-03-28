'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

export default function OrdersPage() {

const [orders, setOrders] = useState([])
const [sidebarOpen, setSidebarOpen] = useState(false)

const userId =
typeof window !== 'undefined'
? localStorage.getItem('userId')
: null

useEffect(() => {
if (!userId) return

```
const q = query(
  collection(db, 'orders'),
  where('userId', '==', userId)
)

const unsub = onSnapshot(q, (snapshot) => {
  const list = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  setOrders(list)
})

return () => unsub()
```

}, [userId])

return (
<>
<Navbar onMenuClick={() => setSidebarOpen(true)} />
<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

```
  <main className="bg-gray-50 min-h-screen p-6 text-black">

    <div className="max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="space-y-6">

          {orders.map(order => (

            <div
              key={order.id}
              className="bg-white border rounded-lg p-5 shadow"
            >

              <div className="flex justify-between mb-3">

                <div>
                  <p className="font-semibold">
                    Order ID
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.id}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    Status
                  </p>
                  <p className="text-purple-700 font-medium">
                    {order.status}
                  </p>
                </div>

              </div>

              <div className="space-y-2">

                {order.items?.map((item, index) => (

                  <div
                    key={index}
                    className="flex justify-between border-t pt-2"
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 object-contain"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                    </div>

                    <p className="text-sm font-semibold">
                      ₹{item.price}
                    </p>

                  </div>

                ))}

              </div>

              <div className="flex justify-between mt-4">

                <p className="font-bold">
                  Total: ₹{order.total}
                </p>

                <Link
                  href={`/order-tracking/${order.id}`}
                  className="text-purple-700 hover:underline"
                >
                  Track Order
                </Link>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>

  </main>
</>

)
}
