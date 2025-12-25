"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative flex items-center justify-center">
      {/* Soccer Field Background with subtle grass texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d1f0d] to-[#0a0a0a] opacity-60"></div>

      {/* Animated Field Lines */}
      <div className="absolute inset-0 opacity-20">
        {/* Horizontal lines */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-white/30"></div>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/40"></div>
        <div className="absolute top-3/4 left-0 right-0 h-px bg-white/30"></div>

        {/* Vertical lines */}
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-white/30"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/40"></div>
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-white/30"></div>

        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/30"></div>
      </div>

      {/* Animated Offside Line - moves in and out */}
      <div className="absolute top-0 bottom-0 left-[45%] w-1 bg-gradient-to-b from-transparent via-[#d3b05c] to-transparent animate-pulse-slow offside-line">
        <div className="absolute top-1/2 -translate-y-1/2 -left-2 -right-2 h-8 bg-[#d3b05c]/20 blur-xl"></div>
      </div>

      {/* Animated Soccer Ball */}
      <div className="absolute top-[35%] left-[44%] animate-bounce-slow">
        <div className="relative w-12 h-12 md:w-16 md:h-16">
          <Image src="/goldball.png" alt="Soccer ball" fill className="object-contain opacity-80" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 text-center">
        {/* Offside Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d3b05c]/10 border border-[#d3b05c] rounded-full mb-6 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-[#d3b05c]" />
          <span className="text-[#d3b05c] text-sm font-bold tracking-wider">ERROR 404</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-slide-up tracking-tight">
          FUERA DE JUEGO
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-4 animate-slide-up-delay-1">Esta página no existe,</p>
        <p className="text-2xl md:text-3xl font-bold text-[#d3b05c] mb-12 animate-slide-up-delay-2">
          pero el partido sigue
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up-delay-3">
          <Link
            href="/"
            className="group relative px-8 py-4 bg-[#d3b05c] text-black font-bold text-lg hover:bg-[#d3b05c]/90 transition-all duration-300 overflow-hidden w-full sm:w-auto"
          >
            <span className="relative z-10">Volver al inicio</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
          </Link>

          <Link
            href="/products"
            className="group px-8 py-4 bg-transparent border-2 border-[#d3b05c] text-[#d3b05c] font-bold text-lg hover:bg-[#d3b05c] hover:text-black transition-all duration-300 w-full sm:w-auto"
          >
            Ver articulos
          </Link>

          <a
            href="/documents/golem-catalog.pdf"
            download
            className="group px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 w-full sm:w-auto"
          >
            Descargar catálogo
          </a>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto animate-slide-up-delay-4">
          <p className="text-sm text-gray-400 mb-3">¿Buscas algo específico?</p>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full px-6 py-3 bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b05c] focus:bg-white/10 transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#d3b05c] hover:text-[#d3b05c]/80 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/10 animate-fade-in-delay">
          <p className="text-sm text-gray-500 mb-4">Enlaces rápidos:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/team" className="text-sm text-gray-400 hover:text-[#d3b05c] transition-colors">
              Equipo
            </Link>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-[#d3b05c] transition-colors">
              Contacto
            </Link>
            <Link href="/products" className="text-sm text-gray-400 hover:text-[#d3b05c] transition-colors">
              Catálogo
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-[#d3b05c] transition-colors">
              Inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#d3b05c]/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
