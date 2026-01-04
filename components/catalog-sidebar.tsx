"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, ChevronDown, Loader2 } from "lucide-react"

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
  const [loadingSubcategories, setLoadingSubcategories] = useState(false)

  // Cargar subcategorías cuando cambia la categoría
  useEffect(() => {
    if (selectedCategoryId) {
      setLoadingSubcategories(true)
      fetch(`/api/subcategories?category_id=${selectedCategoryId}`)
        .then(res => res.json())
        .then(data => setSubcategories(data))
        .catch(err => console.error('Error fetching subcategories:', err))
        .finally(() => setLoadingSubcategories(false))
    } else {
      setSubcategories([])
    }
  }, [selectedCategoryId])

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    
    if (selectedCategoryId) params.set('category_id', selectedCategoryId.toString())
    if (selectedSubcategoryId) params.set('subcategory_id', selectedSubcategoryId.toString())
    if (minPrice) params.set('min_price', minPrice)
    if (maxPrice) params.set('max_price', maxPrice)
    
    router.push(`/products?${params.toString()}`)
    
    if (onClose) onClose()
  }

  const handleClearFilters = () => {
    setSelectedCategoryId(undefined)
    setSelectedSubcategoryId(undefined)
    setMinPrice("")
    setMaxPrice("")
    
    router.push('/products')
    
    if (onClose) onClose()
  }

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategoryId(categoryId)
    setSelectedSubcategoryId(undefined)
    setIsCategoryOpen(false)
  }

  const selectedCategoryName = categories.find(c => c.id === selectedCategoryId)?.name
  const selectedSubcategoryName = subcategories.find(s => s.id === selectedSubcategoryId)?.name

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-highlight/10 rounded transition-colors"
        >
          <X size={24} />
        </button>
      )}

      <h2 className="text-xl lg:text-2xl font-bold text-white">Filtros</h2>

      {/* ⭐ CATEGORÍA - INPUTS MÁS CHICOS */}
      <div>
        <h3 className="font-semibold text-white mb-3 text-sm lg:text-base">Deporte</h3>
        <div className="relative">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full px-3 py-2 text-sm bg-black border cursor-pointer border-highlight/20 hover:border-highlight text-white text-left flex items-center justify-between transition-colors"
          >
            <span className={selectedCategoryId ? "text-white" : "text-gray-400"}>
              {selectedCategoryName || "Seleccionar deporte"}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isCategoryOpen && (
            <div className="absolute z-10 w-full mt-1 bg-black border border-highlight/20 shadow-lg max-h-60 overflow-y-auto">
              <button
                onClick={() => handleCategoryChange(undefined)}
                className="w-full px-3 py-2 text-sm text-left hover:text-[#d3b05c] text-gray-400 transition-colors"
              >
                Todas las categorías
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-highlight/10 hover:text-[#d3b05c] transition-colors ${
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

      {/* ⭐ SUBCATEGORÍA - CON LOADER */}
      <div>
        <h3 className="font-semibold text-white mb-3 text-sm lg:text-base flex items-center gap-2">
          Subcategoría
          {loadingSubcategories && <Loader2 className="animate-spin text-highlight" size={14} />}
        </h3>
        <div className="relative">
          <button
            onClick={() => {
              if (selectedCategoryId && !loadingSubcategories) {
                setIsSubcategoryOpen(!isSubcategoryOpen)
              }
            }}
            disabled={!selectedCategoryId || loadingSubcategories}
            className={`w-full px-3 py-2 text-sm bg-black border text-white text-left flex items-center justify-between transition-colors ${
              selectedCategoryId && !loadingSubcategories
                ? "border-highlight/20 hover:border-highlight cursor-pointer" 
                : "border-highlight/10 cursor-not-allowed opacity-50"
            }`}
          >
            <span className={selectedSubcategoryId ? "text-white" : "text-gray-400"}>
              {loadingSubcategories
                ? "Cargando..."
                : !selectedCategoryId 
                  ? "Primero selecciona un deporte"
                  : selectedSubcategoryName || "Seleccionar subcategoría"
              }
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${isSubcategoryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isSubcategoryOpen && selectedCategoryId && subcategories.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-black border border-highlight/20 shadow-lg max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedSubcategoryId(undefined)
                  setIsSubcategoryOpen(false)
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-highlight/10 text-gray-400 transition-colors"
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
                  className={`w-full px-3 py-2 text-sm text-left hover:text-[#d3b05c] hover:bg-highlight/10 transition-colors ${
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

      {/* ⭐ RANGO DE PRECIO - INPUTS MÁS CHICOS */}
      <div>
        <h3 className="font-semibold text-white mb-3 text-sm lg:text-base">Rango de Precio</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Mínimo</label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full pl-6 pr-2 py-2 text-sm bg-black border border-highlight/20 text-white focus:border-highlight focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Máximo</label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="100000"
                className="w-full pl-6 pr-2 py-2 text-sm bg-black border border-highlight/20 text-white focus:border-highlight focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ BOTONES - CON LOADER */}
      <div className="space-y-2 pt-4">
        <button 
          onClick={handleApplyFilters}
          className="w-full px-4 py-2.5 text-sm bg-highlight hover:bg-[#bc9740] text-black cursor-pointer font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          APLICAR FILTROS
        </button>
        <button
          onClick={handleClearFilters}
          className="w-full cursor-pointer px-4 py-2.5 text-sm text-highlight hover:text-highlight/80 transition-colors font-semibold border border-highlight/20 hover:border-[#d3b05c] disabled:opacity-50"
        >
          LIMPIAR FILTROS
        </button>
      </div>
    </div>
  )
}