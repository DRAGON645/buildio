'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCategories } from '@/context/CategoryContext'
import { useAdminAuth } from '@/context/AdminAuthContext'

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const { isAdmin, logout } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      localStorage.setItem('adminRedirect', '/admin/categories')
      router.push('/admin/login')
    }
  }, [isAdmin, router])

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

  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    showOnHome: true,
    subcategories: []
  })

  const [subInput, setSubInput] = useState({
    name: '',
    slug: '',
    image: ''
  })

  const resetForm = () => {
    setForm({
      name: '',
      slug: '',
      showOnHome: true,
      subcategories: []
    })
    setEditingId(null)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      alert('Name and slug required')
      return
    }

    const categoryData = {
      name: form.name,
      slug: form.slug,
      showOnHome: form.showOnHome,
      subcategories: form.subcategories
    }

    if (editingId) {
      await updateCategory(editingId, categoryData)
    } else {
      await addCategory(categoryData)
    }

    resetForm()
  }

  const handleEdit = (cat) => {
    setEditingId(cat.id)
    setForm({
      name: cat.name,
      slug: cat.slug,
      showOnHome: cat.showOnHome,
      subcategories: cat.subcategories || []
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    await deleteCategory(id)
  }

  const addSubcategory = () => {
    if (!subInput.name || !subInput.slug) {
      alert('Subcategory name and slug required')
      return
    }

    setForm(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, subInput]
    }))

    setSubInput({ name: '', slug: '', image: '' })
  }

  const removeSubcategory = (index) => {
    setForm(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }))
  }

  if (!isAdmin) return null

  return (
    <main className="bg-gray-50 min-h-screen p-6 text-black">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin – Categories</h1>
        <button onClick={logout} className="text-red-600 hover:underline">
          Logout
        </button>
      </div>

      {/* CATEGORY FORM */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="font-semibold mb-4">
          {editingId ? 'Edit Category' : 'Add Category'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Category Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="p-3 border rounded"
          />

          <input
            placeholder="Slug (example: sensors)"
            value={form.slug}
            onChange={e => setForm({ ...form, slug: e.target.value })}
            className="p-3 border rounded"
          />
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
    className="mt-3 h-20 object-contain"
  />
)}


          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.showOnHome}
              onChange={e =>
                setForm({ ...form, showOnHome: e.target.checked })
              }
            />
            Show on Home Page
          </label>
        </div>

        {/* SUBCATEGORY SECTION */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-3">Subcategories</h3>

          <div className="grid md:grid-cols-3 gap-3">
            <input
              placeholder="Subcategory Name"
              value={subInput.name}
              onChange={e =>
                setSubInput({ ...subInput, name: e.target.value })
              }
              className="p-3 border rounded"
            />

            <input
              placeholder="Subcategory Slug"
              value={subInput.slug}
              onChange={e =>
                setSubInput({ ...subInput, slug: e.target.value })
              }
              className="p-3 border rounded"
            />

            <input
              placeholder="Image URL"
              value={subInput.image}
              onChange={e =>
                setSubInput({ ...subInput, image: e.target.value })
              }
              className="p-3 border rounded"
            />
          </div>

          <button
            onClick={addSubcategory}
            className="mt-3 px-4 py-2 bg-purple-700 text-white rounded"
          >
            Add Subcategory
          </button>

          {/* SUBCATEGORY LIST */}
          {form.subcategories.map((sub, index) => (
            <div key={index} className="mt-3 flex justify-between border p-2 rounded">
              <span>{sub.name}</span>
              <button
                onClick={() => removeSubcategory(index)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-purple-700 text-white rounded hover:bg-purple-800"
          >
            {editingId ? 'Update Category' : 'Add Category'}
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

      {/* CATEGORY LIST */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-4">
          Existing Categories
        </h2>

        {categories.map(cat => (
          <div
            key={cat.id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="font-semibold">{cat.name}</p>
              <p className="text-sm text-gray-600">
                Slug: {cat.slug}
              </p>
              <p className="text-sm text-gray-500">
                Subcategories: {cat.subcategories?.length || 0}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(cat)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(cat.id)}
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
