"use client"

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

// Fires PageView on every client-side navigation (first load is handled by the inline script in layout.tsx)
export default function MetaPixelProvider() {
  const pathname = usePathname()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', 'PageView')
    }
  }, [pathname])

  return null
}
