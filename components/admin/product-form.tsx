"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface Category {
  id: number
  name: string
  slug: string
}

interface Subcategory {
  id: number
  category_id: number
  name: string
  slug: string
}

interface Variant {
  id?: number
  size: string
  stock: number
  sku: string
}

interface Product {
  id?: number
  name: string
  slug: string
  description: string
  price: string
  stock: number
  category_id: number
  subcategory_id: number
  brand: string
  color: string
  image_url: string | null
  image_2: string | null
  image_3: string | null
  image_4: string | null
  image_5: string | null
}

interface ProductFormProps {
  product?: Product
  variants?: Variant[]
  categories: Category[]
  subcategories: Subcategory[]
}

export default function ProductForm({ 
  product, 
  variants = [],
  categories, 
  subcategories 
}: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || 0,
    category_id: product?.category_id || 0,
    subcategory_id: product?.subcategory_id || 0,
    brand: product?.brand || "",
    color: product?.color || "",
  })

  // Images
  const [images, setImages] = useState<(string | null)[]>([
    product?.image_url || null,
    product?.image_2 || null,
    product?.image_3 || null,
    product?.image_4 || null,
    product?.image_5 || null,
  ])

  // Variants
  const [productVariants, setProductVariants] = useState<Variant[]>(
    variants.length > 0 ? variants : []
  )

  // Filtrar subcategorías según categoría seleccionada
  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id === formData.category_id
  )

  // Auto-generar slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  // Upload imagen a Cloudinary
  const handleImageUpload = async (index: number, file: File) => {
  setUploadingImage(true)
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!) // ← Tu preset

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error("Error al subir imagen")
    }

    const data = await response.json()
    
    const newImages = [...images]
    newImages[index] = data.secure_url
    setImages(newImages)
  } catch (error) {
    console.error("Error uploading image:", error)
    alert("Error al subir la imagen. Verificá tu configuración de Cloudinary.")
  } finally {
    setUploadingImage(false)
  }
}

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages[index] = null
    setImages(newImages)
  }

  // Gestión de variantes
  const addVariant = () => {
    setProductVariants([
      ...productVariants,
      { size: "", stock: 0, sku: "" }
    ])
  }

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const updated = [...productVariants]
    updated[index] = { ...updated[index], [field]: value }
    setProductVariants(updated)
  }

  const removeVariant = (index: number) => {
    setProductVariants(productVariants.filter((_, i) => i !== index))
  }

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        image_url: images[0],
        image_2: images[1],
        image_3: images[2],
        image_4: images[3],
        image_5: images[4],
        variants: productVariants,
      }

      const url = product 
        ? `/api/admin/products/${product.id}`
        : `/api/admin/products`
      
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push("/admin/products")
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Error al guardar el producto")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al guardar el producto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información Básica */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Información Básica</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Nombre del Producto *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d3b05c]"
              placeholder="Ej: Camiseta Argentina 2024"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Slug (URL) *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d3b05c]"
              placeholder="camiseta-argentina-2024"
            />
            <p className="text-xs text-gray-400 mt-1">Se genera automáticamente desde el nombre</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Descripción *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d3b05c]"
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Precio *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d3b05c]"
                placeholder="19000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Stock Total {productVariants.length > 0 && "(ignorado si hay variantes)"}
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d3b05c]"
              placeholder="10"
              disabled={productVariants.length > 0}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Categoría *</label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ 
                ...formData, 
                category_id: parseInt(e.target.value),
                subcategory_id: 0 // Reset subcategoría
              })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d3b05c]"
            >
              <option value={0}>Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Subcategoría</label>
            <select
              value={formData.subcategory_id}
              onChange={(e) => setFormData({ ...formData, subcategory_id: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d3b05c]"
              disabled={!formData.category_id}
            >
              <option value={0}>Seleccionar subcategoría</option>
              {filteredSubcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Marca</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d3b05c]"
              placeholder="Nike"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Color</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d3b05c]"
              placeholder="Azul"
            />
          </div>
        </div>
      </div>

      {/* Imágenes */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Imágenes del Producto</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square">
              {image ? (
                <div className="relative w-full h-full group">
                  <Image
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    fill
                    className="object-cover rounded-lg border border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-[#d3b05c] text-black text-xs font-bold rounded">
                      Principal
                    </span>
                  )}
                </div>
              ) : (
                <label className="w-full h-full border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#d3b05c] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(index, file)
                    }}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <Loader2 size={24} className="animate-spin text-gray-400" />
                  ) : (
                    <>
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <span className="text-xs text-gray-400 text-center px-2">
                        Imagen {index + 1}
                      </span>
                    </>
                  )}
                </label>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          La primera imagen será la principal. Máximo 5 imágenes.
        </p>
      </div>

      {/* Variantes (Talles) */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Variantes (Talles)</h2>
            <p className="text-sm text-gray-400 mt-1">Opcional. Si no agregás variantes, se usa el stock general.</p>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-2 px-4 py-2 bg-[#d3b05c] text-black font-semibold rounded-lg hover:bg-[#e6c570] transition-colors"
          >
            <Plus size={20} />
            Agregar Talle
          </button>
        </div>

        {productVariants.length > 0 && (
          <div className="space-y-4">
            {productVariants.map((variant, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-800 rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Talle *</label>
                    <input
                      type="text"
                      required={productVariants.length > 0}
                      value={variant.size}
                      onChange={(e) => updateVariant(index, 'size', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-[#d3b05c]"
                      placeholder="S, M, L, XL"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Stock *</label>
                    <input
                      type="number"
                      required={productVariants.length > 0}
                      min="0"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-[#d3b05c]"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">SKU</label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-[#d3b05c]"
                      placeholder="CAM-ARG-M"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors mt-6"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="flex-1 px-6 py-3 bg-[#d3b05c] text-black font-bold rounded-lg hover:bg-[#e6c570] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={20} className="animate-spin" />}
          {product ? "Actualizar Producto" : "Crear Producto"}
        </button>
        
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}