"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react"

interface AdminSidebarProps {
  userName: string
}

export default function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: ShoppingCart, label: "Órdenes", href: "/admin/orders" },
    { icon: Package, label: "Productos", href: "/products" },
    { icon: Users, label: "Clientes", href: "/admin/customers", disabled: true },
    { icon: Settings, label: "Configuración", href: "/admin/settings", disabled: true },
  ]

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg border border-gray-800"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-[#d3b05c]">GOLEM</h1>
            <p className="text-sm text-gray-400 mt-1">Panel Admin</p>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d3b05c] flex items-center justify-center text-black font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm">{userName}</p>
                <p className="text-xs text-gray-400">Administrador</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                const isDisabled = item.disabled

                return (
                  <li key={item.href}>
                    {isDisabled ? (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 cursor-not-allowed">
                        <Icon size={20} />
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="ml-auto text-xs bg-gray-800 px-2 py-1 rounded">Pronto</span>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                          ${isActive 
                            ? 'bg-[#d3b05c] text-black' 
                            : 'text-gray-300 hover:bg-gray-800'
                          }
                        `}
                      >
                        <Icon size={20} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}