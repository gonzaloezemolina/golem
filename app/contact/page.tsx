"use client"

import type React from "react"
import { type FormEvent, useState } from "react"
import { Mail, Phone } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", category: "", message: "" })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-fondo text-white py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-12 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-balance">CONTACTO</h1>
        </div>

        {/* Main Contact Section */}
        <div className="bg-highlight rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
            {/* Left Side - Contact Information */}
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <p className="text-black text-sm uppercase tracking-widest mb-3">ESTAMOS PARA AYUDARTE</p>
                <h2 className="text-3xl text-black md:text-4xl font-bold leading-tight">
                  Comentanos tus
                  <br />
                  Necesidades
                  <br />
                  Deportivas
                </h2>
              </div>

              <p className="text-black mb-12 leading-relaxed">
                ¿Buscas equipamiento de calidad premium para tu entrenamiento? Contáctanos y te ayudaremos a encontrar
                los productos perfectos para ti.
              </p>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <Mail className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-black mb-1">E-mail</p>
                    <p className="text-black font-medium">grupogolem@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Phone className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-black mb-1">Teléfono</p>
                    <p className="text-black font-medium">+341 562-1921</p>
                  </div>
                </div>
              </div>
            </div>

                <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-black -translate-x-1/2"></div>

            {/* Right Side - Contact Form */}
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-black">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Michael Jordan"
                    required
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-highlight transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-black">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="michael@jordan.com"
                    required
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-highlight transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2 text-black">
                    Categoría
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-highlight transition-colors cursor-pointer"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="productos">Sobre Productos</option>
                    <option value="pedidos">Seguimiento de Pedidos</option>
                    <option value="garantia">Garantía y Devoluciones</option>
                    <option value="general">Consulta General</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-black">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    rows={5}
                    required
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-highlight transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold py-3 px-6 rounded hover:bg-highlight/80 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {submitted ? "¡Mensaje Enviado!" : "Enviar Mensaje"}
                </button>
              </form>

              {submitted && (
                <p className="mt-4 text-center text-black text-sm font-medium">
                  Gracias por tu mensaje. Te contactaremos pronto.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
