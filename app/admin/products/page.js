'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProducts } from '@/context/ProductContext'
import { useAdminAuth } from '@/context/AdminAuthContext'

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const { isAdmin, logout } = useAdminAuth()
  const router = useRouter()

  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    featured: false,
    specs: '',
    description: ''
  })

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    if (!isAdmin) {
      localStorage.setItem('adminRedirect', '/admin/products')
      router.push('/admin/login')
    }
  }, [isAdmin, router])

  if (!isAdmin) return null

  // 🔥 CLOUDINARY UPLOAD
  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'buildio_unsigned')

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dujkuppj3/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      const data = await res.json()

      if (!data.secure_url) {
        console.error('Upload failed:', data)
        alert('Upload failed')
        return null
      }

      return data.secure_url
    } catch (err) {
      console.error('Image upload failed', err)
      alert('Image upload failed')
      return null
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const resetForm = () => {
    setForm({
      name: '',
      price: '',
      category: '',
      image: '',
      stock: '',
      featured: false,
      specs: '',
      description: ''
    })
    setEditingId(null)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      alert('Name, price and category are required')
      return
    }

    if (!form.image) {
      alert('Please upload an image')
      return
    }

    const productData = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      image: form.image,
      stock: Number(form.stock) || 0,
      featured: form.featured,
      specs: form.specs ? form.specs.split('\n') : [],
      description: form.description
    }

    if (editingId) {
      await updateProduct(editingId, productData)
    } else {
      await addProduct(productData)
    }

    resetForm()
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image || '',
      stock: product.stock,
      featured: product.featured,
      specs: product.specs?.join('\n') || '',
      description: product.description || ''
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
  }

  return (
    <main className="bg-gray-50 min-h-screen p-6 text-black">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin – Products
        </h1>

        <button
          onClick={logout}
          className="text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* ADD / EDIT FORM */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="font-semibold mb-4">
          {editingId ? 'Edit Product' : 'Add Product'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 border rounded"
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="p-3 border rounded"
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="p-3 border rounded"
          />

          {/* IMAGE UPLOAD */}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0]
              if (!file) return

              const imageUrl = await uploadImage(file)
              if (imageUrl) {
                setForm(prev => ({
                  ...prev,
                  image: imageUrl
                }))
              }
            }}
            className="p-3 border rounded"
          />

          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="mt-3 h-24 object-contain"
            />
          )}

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="p-3 border rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            Featured Product
          </label>
        </div>

        <textarea
          name="specs"
          placeholder="Specs (one per line)"
          value={form.specs}
          onChange={handleChange}
          className="w-full mt-4 p-3 border rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full mt-4 p-3 border rounded"
        />

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-purple-700 text-white rounded hover:bg-purple-800"
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="px-6 py-3 border rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-4">
          Existing Products
        </h2>

        {products.map(p => (
          <div
            key={p.id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-600">
                ₹{p.price} · {p.category} · Stock: {p.stock}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(p)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
