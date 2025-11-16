"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface CatalogSidebarProps {
  onClose?: () => void
}

const categories = ["Footwear", "Apparel", "Equipment"]
const brands = ["Nike", "Adidas", "Puma", "Under Armour", "Golem"]
const colors = [
  { name: "Black", value: "Black", hex: "#000000" },
  { name: "White", value: "White", hex: "#FFFFFF" },
  { name: "Red", value: "Red", hex: "#EF4444" },
  { name: "Blue", value: "Blue", hex: "#3B82F6" },
  { name: "Gray", value: "Gray", hex: "#6B7280" },
]

export default function CatalogSidebar({ onClose }: CatalogSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [onlyInStock, setOnlyInStock] = useState(false)

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedColors([])
    setPriceRange([0, 1000])
    setOnlyInStock(false)
  }

  return (
    <div className="p-6 space-y-8">
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-highlight/10 rounded transition-colors"
        >
          <X size={24} />
        </button>
      )}

      <h2 className="text-2xl font-bold text-white">Filtros</h2>

      {/* Category */}
      <div>
        <h3 className="font-bold text-white mb-4 text-lg">Categoría</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="w-5 h-5 accent-highlight bg-gray-900 border-highlight/30 rounded cursor-pointer"
              />
              <span className="ml-3 text-gray-300 group-hover:text-highlight transition-colors">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-white mb-4 text-lg">Rango de Precio</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-400 text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
            className="w-full accent-highlight"
          />
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="font-bold text-white mb-4 text-lg">Marca</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-5 h-5 accent-highlight bg-gray-900 border-highlight/30 rounded cursor-pointer"
              />
              <span className="ml-3 text-gray-300 group-hover:text-highlight transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="font-bold text-white mb-4 text-lg">Color</h3>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => toggleColor(color.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                selectedColors.includes(color.value)
                  ? "border-highlight scale-110"
                  : "border-gray-600 hover:border-highlight"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Only in Stock */}
      <div>
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="w-5 h-5 accent-highlight bg-gray-900 border-highlight/30 rounded cursor-pointer"
          />
          <span className="ml-3 text-gray-300 group-hover:text-highlight transition-colors">Solo en Stock</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="space-y-3 pt-4">
        <button className="w-full px-4 py-3 bg-highlight text-white font-bold hover:bg-highlight/80 transition-colors">
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
