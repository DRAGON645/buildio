import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ProductProvider } from '@/context/ProductContext'
import { AdminAuthProvider } from '@/context/AdminAuthContext'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

        <AdminAuthProvider>
          <ProductProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ProductProvider>
        </AdminAuthProvider>
      </body>
    </html>
  )
}
