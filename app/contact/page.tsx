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

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: "", email: "", category: "", message: "" })
      }, 3000)
    } else {
      alert('Error al enviar el mensaje. Por favor intentá de nuevo.')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error al enviar el mensaje. Por favor intentá de nuevo.')
  }
}

  return (
    <div className="min-h-screen text-white py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-12 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-balance">CONTACTO</h1>
        </div>

        {/* Main Contact Section */}
        <div className="bg-stone-950 border-1 border-stone-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
            {/* Left Side - Contact Information */}
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <p className="text-highlight text-sm uppercase tracking-widest mb-3">ESTAMOS PARA AYUDARTE</p>
                <h2 className="text-3xl text-white md:text-4xl font-bold leading-tight">
                  Comentanos tus
                  <br />
                  Necesidades
                  <br />
                </h2>
              </div>

              <p className="text-white mb-12 leading-relaxed">
                Acompañamos en cada jugada.
Consultas, productos o seguimiento de pedidos, estamos para ayudarte. Mandanos tu mensaje y responderemos a la brevedad.
              </p>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <Mail className="w-5 h-5 text-highlight flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-white mb-1">E-mail</p>
                    <p className="text-white font-medium">equipo@send.golem.com.ar</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Phone className="w-5 h-5 text-highlight flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-white mb-1">Teléfono</p>
                    <p className="text-white font-medium">+341 562-1921</p>
                  </div>
                </div>
              </div>
            </div>

                {/* <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-stone-800 -translate-x-1/2"></div> */}

            {/* Right Side - Contact Form */}
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-highlight">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Lionel Messi"
                    required
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-highlight transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-highlight">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="lionel@messi.com"
                    required
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-highlight transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2 text-highlight">
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
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-highlight">
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
                  className="w-full hover:bg-[#ab8839] bg-highlight text-white font-bold py-3 px-6 rounded cursor-pointer hover:bg-highlight/80 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {submitted ? "¡ENVIADO!" : "ENVIAR MENSAJE"}
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
