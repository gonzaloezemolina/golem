"use client"

import { useState, useEffect } from "react"

const promotions = [
  "Envío sin costo en Rosario",
  "Descuento camisetas Fútbol Argentino en $14900",
  "Camisetas Argentina Mundial en $19900",
]

export default function PreHeader() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % promotions.length)
        setVisible(true)
      }, 400)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full px-4 text-center text-white text-xs sm:text-sm font-medium tracking-widest uppercase overflow-hidden" style={{ backgroundColor: "#d3b05c" }}>
      <span
        className="inline-block transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        {promotions[current]}
      </span>
    </div>
  )
}
