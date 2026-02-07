'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔥 FETCH PRODUCTS FROM FIRESTORE
  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'))
      const list = snapshot.docs.map(d => ({
        id: d.id,          // ✅ Firestore document ID
        ...d.data()
      }))
      setProducts(list)
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // ✅ ADD PRODUCT (ADMIN)
  const addProduct = async (product) => {
    // 🔥 IMPORTANT: never store `id` inside Firestore
    const { id, ...cleanProduct } = product

    await addDoc(collection(db, 'products'), {
      ...cleanProduct,
      createdAt: new Date()
    })

    fetchProducts()
  }

  // ✅ UPDATE PRODUCT (ADMIN)
  const updateProduct = async (id, updatedData) => {
    if (!id) {
      console.error('Invalid product ID for update:', id)
      return
    }

    const ref = doc(db, 'products', id)
    await updateDoc(ref, updatedData)
    fetchProducts()
  }

  // ✅ DELETE PRODUCT (ADMIN)
  const deleteProduct = async (id) => {
    if (!id) {
      console.error('Invalid product ID for delete:', id)
      return
    }

    await deleteDoc(doc(db, 'products', id))
    fetchProducts()
  }

  // 🔥 REDUCE STOCK (AFTER ORDER)
  const reduceStock = async (items) => {
    for (const item of items) {
      const ref = doc(db, 'products', item.id)
      await updateDoc(ref, {
        stock: item.stock - item.qty
      })
    }
    fetchProducts()
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        reduceStock
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductContext)
}
