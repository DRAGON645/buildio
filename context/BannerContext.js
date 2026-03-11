'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

const BannerContext = createContext(null)

export function BannerProvider({ children }) {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'banners'),
      orderBy('order', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
      setBanners(list)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addBanner = async (data) => {
    await addDoc(collection(db, 'banners'), {
      ...data,
      createdAt: Timestamp.now()
    })
  }

  const updateBanner = async (id, data) => {
    await updateDoc(doc(db, 'banners', id), data)
  }

  const deleteBanner = async (id) => {
    await deleteDoc(doc(db, 'banners', id))
  }

  return (
    <BannerContext.Provider
      value={{
        banners,
        loading,
        addBanner,
        updateBanner,
        deleteBanner
      }}
    >
      {children}
    </BannerContext.Provider>
  )
}

export function useBanners() {
  return useContext(BannerContext)
}
