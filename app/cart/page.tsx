"use client"

import { useCartStore } from "@/lib/store/cart-store"
import { useShippingStore, ShippingAddress } from "@/lib/store/shipping-store"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Trash2, Plus, Minus, Truck, Shield, Loader2 } from 'lucide-react'
import { obtenerLocalidades } from "@/app/utils/georef"
import { calcularEnvio, ShippingResult } from "@/app/utils/shipping"
import provinciasData from "@/app/data/provincias.json"

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const [localidades, setLocalidades] = useState<any[]>([])
  const [loadingLocalidades, setLoadingLocalidades] = useState(false)
  const [calculandoEnvio, setCalculandoEnvio] = useState(false)

  const savedAddress = useShippingStore((state) => state.address)
  const savedCost = useShippingStore((state) => state.cost)
  const saveShippingAddress = useShippingStore((state) => state.setAddress)
  const saveShippingCost = useShippingStore((state) => state.setCost)

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    provinciaId: "",
    provinciaNombre: "",
    codigoPostal: "",
    ciudadNombre: "",
    domicilio: "",
    pisoDepto: "",
    tipoEntrega: "domicilio", // "domicilio" o "retiro"
  })

  const [shippingCost, setShippingCost] = useState<ShippingResult>({
    costo: 0,
    zona: '',
    mensaje: '',
    esGratis: false
  })

  const items = useCartStore((state: any) => state.items)
  const removeItem = useCartStore((state: any) => state.removeItem)
  const updateQuantity = useCartStore((state: any) => state.updateQuantity)
  const getTotal = useCartStore((state: any) => state.getTotal)
  const clearCart = useCartStore((state: any) => state.clearCart)


  // Validar si el formulario está completo
  const isFormValid = 
    shippingAddress.provinciaId && 
    shippingAddress.ciudadNombre && 
    shippingAddress.codigoPostal && 
    // shippingAddress.domicilio &&
    (shippingAddress.tipoEntrega === "retiro" || shippingAddress.domicilio)

  // Detectar si es Rosario
  const isRosario = 
    shippingAddress.provinciaNombre.toLowerCase().includes('santa fe') && 
    shippingAddress.ciudadNombre.toLowerCase().includes('rosario')

  useEffect(() => {
    setMounted(true)
     if (savedAddress) {
      setShippingAddress(savedAddress)
    } else {
    // ⭐ SI NO HAY ADDRESS GUARDADA, RESETEAR A DOMICILIO
    setShippingAddress(prev => ({
      ...prev,
      tipoEntrega: "domicilio"
    }))
  }
    if (savedCost) {
      setShippingCost(savedCost)
    }
  }, [savedAddress, savedCost])

  // Cargar localidades
useEffect(() => {
  if (shippingAddress.provinciaId) {
    setLoadingLocalidades(true)
    setLocalidades([]) // Limpiar localidades anteriores
    
    obtenerLocalidades(shippingAddress.provinciaId)
      .then(setLocalidades)
      .finally(() => setLoadingLocalidades(false))
  } else {
    setLocalidades([]) // Limpiar si no hay provincia
  }
}, [shippingAddress.provinciaId]) // Solo depende de provinciaId

  // Calcular envío con LOADER
  useEffect(() => {
    if (shippingAddress.provinciaNombre && shippingAddress.ciudadNombre) {
      setCalculandoEnvio(true)
      
      // Simular delay de cálculo (800ms)
      setTimeout(() => {
        const resultado = calcularEnvio(
          shippingAddress.provinciaNombre,
          shippingAddress.ciudadNombre
        )
        setShippingCost(resultado)
        setCalculandoEnvio(false)
      }, 800)
    } else {
      setShippingCost({
        costo: 0,
        zona: '',
        mensaje: '',
        esGratis: false
      })
    }
  }, [shippingAddress.provinciaNombre, shippingAddress.ciudadNombre])

  // NUEVO: Forzar "domicilio" cuando NO es Rosario
useEffect(() => {
  if (!isRosario && shippingAddress.tipoEntrega === "retiro") {
    setShippingAddress(prev => ({
      ...prev,
      tipoEntrega: "domicilio"
    }))
  }
}, [isRosario, shippingAddress.tipoEntrega])

  useEffect(() => {
  if (isFormValid) {
    saveShippingAddress(shippingAddress)
  }
}, [shippingAddress, isFormValid, saveShippingAddress])

// NUEVO: Guardar costo automáticamente
useEffect(() => {
  if (shippingCost.zona) {
    saveShippingCost(shippingCost)
  }
}, [shippingCost, saveShippingCost])

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.options[e.target.selectedIndex]
    const provinciaId = selectedOption.value
    const provinciaNombre = selectedOption.text

    setShippingAddress(prev => ({
      ...prev,
      provinciaId: provinciaId,
      provinciaNombre: provinciaNombre,
      ciudadNombre: "",
    }))
  }

  const handleCiudadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ciudadNombre = e.target.value
    
    setShippingAddress(prev => ({
      ...prev,
      ciudadNombre: ciudadNombre,
    }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTipoEntregaChange = (tipo: 'domicilio' | 'retiro') => {
    setShippingAddress(prev => ({
      ...prev,
      tipoEntrega: tipo
    }))
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <h1 className="text-2xl font-bold text-white mb-2">Cargando carrito...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Carrito</h1>
          <p className="text-gray-400 mb-8">No hay productos seleccionados.</p>
          <Link 
            href="/products" 
            className="inline-block bg-[#d3b05c] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#e6c570] transition-colors"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = getTotal()
  const total = subtotal + shippingCost.costo

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-8">MIS PRODUCTOS</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-2">
            
            {/* Productos */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6 border border-[#333]">
              <h2 className="text-xl font-bold text-white mb-6">Selección de productos</h2>
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-[#333] last:border-0">
                    
                    <div className="relative w-20 h-20 bg-[#2a2a2a] rounded-lg flex-shrink-0 border border-[#444] overflow-hidden">
                      <Image className="object-cover" fill src={item.image_url} alt={item.name} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-400 mb-1">${item.price.toFixed(2)}</p>
                      {item.size && (
                        <p className="text-xs text-gray-500">Talle: {item.size}</p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-[#333] rounded transition-colors"
                        >
                          <Minus size={16} className="text-gray-400" />
                        </button>
                        <p className="text-white w-8 text-center">{item.quantity}</p>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.total_stock || 999)}
                          className={`p-1 rounded transition-colors ${
                            item.quantity >= (item.total_stock || 999)
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-[#333]'
                          }`}
                        >
                          <Plus size={16} className="text-gray-400" />
                        </button>
                        {item.total_stock && item.quantity >= item.total_stock && (
                          <span className="text-xs text-yellow-500 ml-2">Stock máximo</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dirección */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Truck size={20} className="text-[#d3b05c]" />
                Dirección de facturación y envío
              </h3>

              {/* Formulario */}
              <div className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Provincia */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Provincia *</label>
                    <select
                      value={shippingAddress.provinciaId}
                      onChange={handleProvinciaChange}
                      className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d3b05c] transition-colors"
                    >
                      <option value="">Seleccioná tu provincia</option>
                      {provinciasData.map(prov => (
                        <option key={prov.id} value={prov.id} className="text-white hover:text-highlight">
                          {prov.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Código Postal */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Código Postal *</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={shippingAddress.codigoPostal}
                      onChange={handleAddressChange}
                      placeholder="Ej: 2000"
                      className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#d3b05c] transition-colors"
                    />
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Localidad *</label>
                    <select
                      value={shippingAddress.ciudadNombre}
                      onChange={handleCiudadChange}
                      disabled={!shippingAddress.provinciaId || loadingLocalidades}
                      className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d3b05c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {loadingLocalidades 
                          ? 'Cargando...' 
                          : shippingAddress.provinciaId 
                            ? 'Seleccioná tu ciudad' 
                            : 'Primero seleccioná provincia'}
                      </option>
                      {localidades.map(loc => (
                        <option key={loc.id} value={loc.nombre}>
                          {loc.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Domicilio */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Domicilio {shippingAddress.tipoEntrega === "retiro" ? "(Opcional)" : "*"}
                    </label>
                    <input
                      type="text"
                      name="domicilio"
                      value={shippingAddress.domicilio}
                      onChange={handleAddressChange}
                      placeholder="Ej: Av. Pellegrini 1250"
                      disabled={shippingAddress.tipoEntrega === "retiro"}
                      className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#d3b05c] transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Piso/Depto */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">
                      Piso/Departamento <span className="text-gray-600">(Opcional)</span>
                    </label>
                    <input
                      type="text"
                      name="pisoDepto"
                      value={shippingAddress.pisoDepto}
                      onChange={handleAddressChange}
                      placeholder="Ej: Piso 3, Depto B"
                      disabled={shippingAddress.tipoEntrega === "retiro"}
                      className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#d3b05c] transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* TIPO DE ENTREGA - SOLO ROSARIO */}
                {isRosario && (
                  <div className="mt-6 pt-6 border-t border-[#333]">
                    <h4 className="text-white font-semibold mb-4">Método de entrega</h4>
                    <div className="space-y-3">
                      {/* Envío a domicilio */}
                      <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        shippingAddress.tipoEntrega === "domicilio"
                          ? 'border-[#d3b05c] bg-[#d3b05c]/10'
                          : 'border-[#444] hover:border-[#666]'
                      }`}>
                        <input
                          type="radio"
                          name="tipoEntrega"
                          value="domicilio"
                          checked={shippingAddress.tipoEntrega === "domicilio"}
                          onChange={() => handleTipoEntregaChange("domicilio")}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="text-white font-semibold">Envío a domicilio</p>
                          <p className="text-sm text-gray-400">Recibilo en tu casa, estimado de 1-2 días hábiles</p>
                        </div>
                        <p className="text-[#d3b05c] font-bold">GRATIS</p>
                      </label>

                      {/* Retiro en punto */}
                      <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        shippingAddress.tipoEntrega === "retiro"
                          ? 'border-[#d3b05c] bg-[#d3b05c]/10'
                          : 'border-[#444] hover:border-[#666]'
                      }`}>
                        <input
                          type="radio"
                          name="tipoEntrega"
                          value="retiro"
                          checked={shippingAddress.tipoEntrega === "retiro"}
                          onChange={() => handleTipoEntregaChange("retiro")}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="text-white font-semibold">Retiro en punto</p>
                          <p className="text-sm text-gray-400">Bv. Oroño 3614, Rosario</p>
                        </div>
                        <p className="text-[#d3b05c] font-bold">GRATIS</p>
                      </label>
                    </div>
                  </div>
                )}

                {/* RESULTADO DEL CÁLCULO - DEBAJO DEL FORMULARIO */}
               {/* RESULTADO DEL CÁLCULO - SOLO SI NO ES ROSARIO */}
{calculandoEnvio ? (
  <div className="mt-6 p-4 border border-[#d3b05c] rounded-lg bg-[#2a2a2a] flex items-center justify-center gap-3">
    <Loader2 className="animate-spin text-[#d3b05c]" size={20} />
    <p className="text-white">Calculando costo de envío...</p>
  </div>
) : (
  // SOLO MOSTRAR SI NO ES ROSARIO
  shippingCost.zona && !isRosario && (
    <div className="mt-6 p-4 border border-[#d3b05c] rounded-lg bg-[#2a2a2a]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">{shippingCost.mensaje}</p>
          <p className="text-sm text-gray-400">{shippingCost.zona}</p>
        </div>
        <p className="text-2xl text-[#d3b05c] font-bold">
          ${shippingCost.costo.toFixed(2)}
        </p>
      </div>
    </div>
  )
)}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA - Resumen */}
          <div>
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333] sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Detalles de Pago</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-[#333]">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Envío</span>
                  <span className={shippingCost.esGratis ? 'text-[#d3b05c] font-semibold' : ''}>
                    {shippingCost.costo === 0 && !shippingCost.esGratis 
                      ? 'A calcular' 
                      : shippingCost.esGratis 
                        ? 'GRATIS' 
                        : `$${shippingCost.costo.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl pt-4 border-t border-[#444]">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#d3b05c] font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* BOTÓN CON VALIDACIÓN */}
              <Link 
                href={isFormValid ? "/checkout" : "#"}
                className={`w-full block text-center font-bold py-3 rounded-lg transition-colors mb-4 ${
                  isFormValid
                    ? 'bg-[#d3b05c] text-black hover:bg-[#e6c570] cursor-pointer'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none'
                }`}
              >
                {isFormValid ? 'PROCEDER AL PAGO' : 'Completá los datos de envío'}
              </Link>

              <Link 
                href="/products"
                className="w-full block text-center border border-[#d3b05c] text-[#d3b05c] font-semibold py-2 rounded-lg hover:bg-[#d3b05c]/10 transition-colors mb-4"
              >
                Continuar Comprando
              </Link>

              <button
                onClick={clearCart}
                className="w-full text-gray-400 text-sm hover:text-red-500 transition-colors py-2"
              >
                Vaciar Carrito
              </button>

              <div className="mt-6 pt-6 border-t border-[#333] flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield size={16} />
                <span>Pago 100% Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}