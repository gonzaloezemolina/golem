"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; // ← Import
import { Menu, X } from "lucide-react";
import CatalogSidebar from "@/components/catalog-sidebar";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname(); // ← Obtener ruta actual

  // ✅ Ocultar sidebar si estamos en /products/[slug]
  const isProductDetail = pathname.split("/").length > 2; // /products/remera-negra tiene 3 partes

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Desktop Sidebar - Solo mostrar si NO es detalle */}
      {!isProductDetail && (
        <div className="hidden lg:block w-80 bg-black border-r border-highlight/20 overflow-y-auto">
          <CatalogSidebar />
        </div>
      )}

      {/* Mobile Hamburger & Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!isProductDetail && (
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-highlight/20">
            <h1 className="text-xl font-bold">Catálogo</h1>
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
            <div className="absolute left-0 top-16 w-80 bg-black border-r border-highlight/20 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <CatalogSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}