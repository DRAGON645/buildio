import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ProductProvider } from '@/context/ProductContext'
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import { CategoryProvider } from '@/context/CategoryContext'





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
        <CategoryProvider>
          <ProductProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ProductProvider>
          </CategoryProvider>
        </AdminAuthProvider>
      </body>
    </html>
  )
}


