"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, ChevronDown } from "lucide-react"

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

interface CatalogSidebarProps {
  onClose?: () => void
  categories: Category[]
}

export default function CatalogSidebar({ onClose, categories }: CatalogSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Leer filtros actuales de la URL
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(
    searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : undefined
  )
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | undefined>(
    searchParams.get('subcategory_id') ? parseInt(searchParams.get('subcategory_id')!) : undefined
  )
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('min_price') || "")
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('max_price') || "")
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false)
  
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  // Cargar subcategorías cuando cambia la categoría
  useEffect(() => {
    if (selectedCategoryId) {
      fetch(`/api/subcategories?category_id=${selectedCategoryId}`)
        .then(res => res.json())
        .then(data => setSubcategories(data))
        .catch(err => console.error('Error fetching subcategories:', err))
    } else {
      setSubcategories([])
      setSelectedSubcategoryId(undefined)
    }
  }, [selectedCategoryId])

  const handleApplyFilters = () => {
    // Construir nueva URL con filtros
    const params = new URLSearchParams()
    
    if (selectedCategoryId) params.set('category_id', selectedCategoryId.toString())
    if (selectedSubcategoryId) params.set('subcategory_id', selectedSubcategoryId.toString())
    if (minPrice) params.set('min_price', minPrice)
    if (maxPrice) params.set('max_price', maxPrice)
    
    // Navegar a la nueva URL (esto hace que Next.js re-renderice la página)
    router.push(`/products?${params.toString()}`)
    
    if (onClose) onClose()
  }

  const handleClearFilters = () => {
    setSelectedCategoryId(undefined)
    setSelectedSubcategoryId(undefined)
    setMinPrice("")
    setMaxPrice("")
    
    // Navegar a /products sin params
    router.push('/products')
    
    if (onClose) onClose()
  }

  const selectedCategoryName = categories.find(c => c.id === selectedCategoryId)?.name
  const selectedSubcategoryName = subcategories.find(s => s.id === selectedSubcategoryId)?.name

  return (
    <div className="p-6 space-y-8">
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-highlight/10 rounded transition-colors"
        >
          <X size={24} />
        </button>
      )}

      <h2 className="text-2xl font-bold text-white">Filtros</h2>

      {/* Categoría */}
      <div>
        <h3 className="font-bold text-white mb-4 text-lg">Deporte</h3>
        <div className="relative">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full px-4 py-3 bg-black border border-highlight/20 hover:border-highlight text-white text-left flex items-center justify-between transition-colors"
          >
            <span className={selectedCategoryId ? "text-white" : "text-gray-400"}>
              {selectedCategoryName || "Selecciona un deporte"}
            </span>
            <ChevronDown
              size={20}
              className={`transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isCategoryOpen && (
            <div className="absolute z-10 w-full mt-1 bg-black border border-highlight/20 shadow-lg">
              <button
                onClick={() => {
                  setSelectedCategoryId(undefined)
                  setIsCategoryOpen(false)
                }}
                className="w-full px-4 py-2 text-left hover:bg-highlight/10 text-gray-400 transition-colors"
              >
                Todas las categorías
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategoryId(category.id)
                    setIsCategoryOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-highlight/10 transition-colors ${
                    selectedCategoryId === category.id
                      ? "bg-highlight/20 text-highlight"
                      : "text-white"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subcategoría */}
      {selectedCategoryId && subcategories.length > 0 && (
        <div>
          <h3 className="font-bold text-white mb-4 text-lg">Subcategoría</h3>
          <div className="relative">
            <button
              onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
              className="w-full px-4 py-3 bg-black border border-highlight/20 hover:border-highlight text-white text-left flex items-center justify-between transition-colors"
            >
              <span className={selectedSubcategoryId ? "text-white" : "text-gray-400"}>
                {selectedSubcategoryName || "Seleccionar subcategoría"}
              </span>
              <ChevronDown
                size={20}
                className={`transition-transform ${isSubcategoryOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isSubcategoryOpen && (
              <div className="absolute z-10 w-full mt-1 bg-black border border-highlight/20 shadow-lg">
                <button
                  onClick={() => {
                    setSelectedSubcategoryId(undefined)
                    setIsSubcategoryOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-highlight/10 text-gray-400 transition-colors"
                >
                  Todas las subcategorías
                </button>
                {subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => {
                      setSelectedSubcategoryId(subcategory.id)
                      setIsSubcategoryOpen(false)
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-highlight/10 transition-colors ${
                      selectedSubcategoryId === subcategory.id
                        ? "bg-highlight/20 text-highlight"
                        : "text-white"
                    }`}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rango de Precio */}
      <div>
        <h3 className="font-bold text-white mb-4 text-lg">Rango de Precio</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Mínimo</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-2 bg-black border border-highlight/20 text-white focus:border-highlight focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Máximo</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="100000"
                className="w-full pl-7 pr-3 py-2 bg-black border border-highlight/20 text-white focus:border-highlight focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3 pt-4">
        <button 
          onClick={handleApplyFilters}
          className="w-full px-4 py-3 bg-highlight text-black font-bold hover:bg-highlight/80 transition-colors"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={handleClearFilters}
          className="w-full px-4 py-3 text-highlight hover:text-highlight/80 transition-colors font-semibold border border-highlight/20 hover:border-highlight/60"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  )
}