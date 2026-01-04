"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // ⭐ RUTAS DONDE NO MOSTRAR HEADER/FOOTER
  const hideLayout = 
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname === "/not-found" ||
    pathname === "/404"

  if (hideLayout) {
    return <>{children}</>
  }

  // ⭐ RUTAS NORMALES (CON HEADER/FOOTER)
  return (
    <>
      <Header />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  )
}