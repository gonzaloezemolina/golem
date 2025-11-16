"use client"

import { useState } from "react"
import { Menu, X, Search } from "lucide-react"
import CartIcon from "./cartIcon"
import Link from "next/link"


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [{li:"TIENDA",link:"/products"}, {li:"EQUIPO",link:"/team"}, {li:"CONTACTO",link:"/contact"}];

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
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="w-full flex items-center  bg-none py-2 border-b border-highlight">
              {/* <Search size={18} className="text-highlight flex-shrink-0" /> */}
              <input
                type="text"
                placeholder="BUSCAR"
                className="ml-2 bg-transparent tracking-widest text-white placeholder-white/60 outline-none w-full text-sm"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item.li} href={item.link} className="text-white text-sm font-medium hover:text-highlight transition-colors">
                {item.li}
              </a>
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
            <div className="mb-4 flex items-center bg-white/10 rounded px-4 py-2 border border-highlight/30">
              <Search size={18} className="text-highlight flex-shrink-0" />
              <input
                type="text"
                placeholder="BUSCAR"
                className="ml-2 bg-transparent text-white placeholder-white/60 outline-none w-full text-sm"
              />
            </div>

            {/* Mobile Navigation Items */}
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.li}
                  href={item.link}
                  className="text-white text-sm font-medium hover:text-highlight transition-colors py-2"
                >
                  {item.li}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
