"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "5493415621921"; // Formato: código país + área + número (sin espacios ni guiones)
  const message = "Hola, estoy interesado en los productos de Golem"; // Mensaje predefinido

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      
      {/* Tooltip que aparece al hover */}
      <span className="hidden group-hover:inline-block whitespace-nowrap text-sm font-medium">
        Chateá con nosotros
      </span>
    </button>
  );
}