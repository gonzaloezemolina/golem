"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "5493416831218"; // Formato: código país + área + número (sin espacios ni guiones)
  const message = "Hola, estoy interesado en los productos de Golem"; // Mensaje predefinido

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed w-12 h-12 cursor-pointer bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full  shadow-lg transition-all duration-300 hover:scale-110 flex justify-center items-center gap-2 group"
      aria-label="Contactar por WhatsApp"
    >
      <i className="bi bi-whatsapp p-0 m-0 flex justify-center items-center text-2xl"></i>
    </button>
  );
}