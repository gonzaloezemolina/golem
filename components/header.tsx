"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, Search } from "lucide-react"
import CartIcon from "./cartIcon"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: number
  name: string
  slug: string
  price: number
  image_url: string | null
  category: string | null
  brand: string | null
}

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Estados de búsqueda
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { li: "TIENDA", link: "/products" },
    { li: "EQUIPO", link: "/team" },
    { li: "CONTACTO", link: "/contact" }
  ]

  // Búsqueda con debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        setSearchResults(data)
        setShowResults(true)
      } catch (error) {
        console.error("Error en búsqueda:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle Enter - ir al catálogo con filtro
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowResults(false)
      setIsMenuOpen(false)
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Click en sugerencia - ir al producto
  const handleResultClick = (slug: string) => {
    setShowResults(false)
    setSearchQuery("")
    setIsMenuOpen(false)
    router.push(`/products/${slug}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/">
            <div className="w-35 flex justify-center items-center">
              <img src="/isologov2.png" className="w-full h-full" alt="Golem" />
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="w-full flex items-center bg-none py-2 border-b border-highlight">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  placeholder="BUSCAR"
                  className="ml-2 bg-transparent tracking-widest text-white placeholder-white/60 outline-none w-full text-sm"
                />
                {isSearching && (
                  <div className="animate-spin h-4 w-4 border-2 border-highlight border-t-transparent rounded-full" />
                )}
              </div>
            </form>

            {/* Desktop Dropdown Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-highlight/30 rounded-lg shadow-xl overflow-hidden z-50">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.slug)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-highlight/10 transition-colors border-b border-gray-800 last:border-0"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                      {result.image_url ? (
                        <Image
                          src={result.image_url}
                          alt={result.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Search size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white text-sm font-semibold line-clamp-1">
                        {result.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {result.category} {result.brand && `• ${result.brand}`}
                      </p>
                    </div>
                    <p className="text-highlight font-bold text-sm">
                      ${Number(result.price).toLocaleString()}
                    </p>
                  </button>
                ))}
                <div className="p-2 bg-gray-800/50 text-center">
                  <button
                    onClick={handleSearch}
                    className="text-xs text-highlight hover:underline"
                  >
                    Ver todos los resultados →
                  </button>
                </div>
              </div>
            )}

            {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-highlight/30 rounded-lg shadow-xl p-4 text-center z-50">
                <p className="text-gray-400 text-sm">No se encontraron productos</p>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.li}
                href={item.link}
                className="text-white text-sm font-medium hover:text-highlight transition-colors"
              >
                {item.li}
              </Link>
            ))}
            <CartIcon />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <CartIcon />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:text-highlight transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-highlight/20">
            {/* Mobile Search Bar */}
            <div className="mb-4 relative">
              <form onSubmit={handleSearch}>
                <div className="flex items-center bg-white/10 rounded px-4 py-2 border border-highlight/30">
                  <Search size={18} className="text-highlight flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="BUSCAR"
                    className="ml-2 bg-transparent text-white placeholder-white/60 outline-none w-full text-sm"
                  />
                  {isSearching && (
                    <div className="animate-spin h-4 w-4 border-2 border-highlight border-t-transparent rounded-full" />
                  )}
                </div>
              </form>

              {/* Mobile Dropdown Results */}
              {searchQuery.length >= 2 && searchResults.length > 0 && (
                <div className="mt-2 bg-gray-900 border border-highlight/30 rounded-lg overflow-hidden">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.slug)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-highlight/10 transition-colors border-b border-gray-800 last:border-0"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                        {result.image_url ? (
                          <Image
                            src={result.image_url}
                            alt={result.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <Search size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white text-sm font-semibold line-clamp-1">
                          {result.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {result.category}
                        </p>
                      </div>
                      <p className="text-highlight font-bold text-sm">
                        ${Number(result.price).toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Navigation Items */}
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.li}
                  href={item.link}
                  className="text-white text-sm font-medium hover:text-highlight transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.li}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}