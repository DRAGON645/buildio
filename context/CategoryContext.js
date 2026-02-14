'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

const CategoryContext = createContext(null)

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔥 REALTIME FETCH
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const list = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }))
        setCategories(list)
        setLoading(false)
      },
      (error) => {
        console.error('Category fetch error:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // ➕ ADD CATEGORY
  const addCategory = async (data) => {
    await addDoc(collection(db, 'categories'), {
      ...data,
      createdAt: Timestamp.now()
    })
  }

  // ✏️ UPDATE CATEGORY
  const updateCategory = async (id, data) => {
    const ref = doc(db, 'categories', id)
    await updateDoc(ref, data)
  }

  // ❌ DELETE CATEGORY
  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, 'categories', id))
  }

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        addCategory,
        updateCategory,
        deleteCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategories() {
  return useContext(CategoryContext)
}
