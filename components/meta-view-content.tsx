"use client"

import { useEffect } from 'react'

interface MetaViewContentProps {
  productId: number
  name: string
  category?: string | null
  value: number
  currency?: string
}

export default function MetaViewContent({
  productId,
  name,
  category,
  value,
  currency = 'ARS',
}: MetaViewContentProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', 'ViewContent', {
        content_ids: [productId.toString()],
        content_name: name,
        content_category: category ?? undefined,
        value,
        currency,
      })
    }
  }, [])

  return null
}
