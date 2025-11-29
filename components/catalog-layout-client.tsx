"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import CatalogSidebar from "@/components/catalog-sidebar"

interface Category {
  id: number
  name: string
  slug: string
}

interface CatalogLayoutClientProps {
  children: React.ReactNode
  categories: Category[]
}

export default function CatalogLayoutClient({ children, categories }: CatalogLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Ocultar sidebar si estamos en /products/[slug]
  const isProductDetail = pathname.split("/").length > 2

  return (
    <div className="min-h-screen text-white">
      <div className="flex">
        {/* Desktop Sidebar - Sticky */}
        {!isProductDetail && (
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-0 h-screen overflow-y-auto scrollbar-hide">
              <CatalogSidebar categories={categories} />
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Header */}
          {!isProductDetail && (
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-highlight/20 sticky top-0 bg-black z-30">
              <h1 className="text-xl font-bold">CATÁLOGO</h1>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-highlight/10 rounded transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}

          {/* Mobile Sidebar Drawer */}
          {!isProductDetail && sidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="fixed left-0 top-0 w-80 h-full bg-black border-r border-highlight/20 z-50 overflow-y-auto lg:hidden">
                <CatalogSidebar categories={categories} onClose={() => setSidebarOpen(false)} />
              </div>
            </>
          )}

          {/* Content */}
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}