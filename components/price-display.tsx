interface PriceDisplayProps {
  price: number | string
  salePrice?: number | string | null
  onSale?: boolean
  size?: "sm" | "md" | "lg"
}

export function calcDiscount(price: number, salePrice: number): number {
  return Math.round((1 - salePrice / price) * 100)
}

export function getEffectivePrice(
  price: number | string,
  salePrice: number | string | null | undefined,
  onSale: boolean | undefined
): number {
  if (onSale && salePrice != null) {
    return parseFloat(salePrice.toString())
  }
  return parseFloat(price.toString())
}

export default function PriceDisplay({ price, salePrice, onSale, size = "md" }: PriceDisplayProps) {
  const numPrice = parseFloat(price.toString())
  const numSalePrice = salePrice != null ? parseFloat(salePrice.toString()) : null

  const sizeClasses = {
    sm: { main: "text-xl font-bold", original: "text-sm", badge: "text-xs px-1.5 py-0.5" },
    md: { main: "text-2xl font-bold", original: "text-sm", badge: "text-xs px-2 py-0.5" },
    lg: { main: "text-3xl md:text-4xl font-bold", original: "text-base", badge: "text-sm px-2 py-1" },
  }

  const cls = sizeClasses[size]

  if (!onSale || numSalePrice == null) {
    return (
      <span className={`${cls.main} text-highlight`}>
        ${numPrice.toLocaleString("es-AR")}
      </span>
    )
  }

  const discount = calcDiscount(numPrice, numSalePrice)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`${cls.main} text-highlight`}>
        ${numSalePrice.toLocaleString("es-AR")}
      </span>
      <span className={`${cls.original} text-gray-400 line-through`}>
        ${numPrice.toLocaleString("es-AR")}
      </span>
      <span className={`${cls.badge} bg-red-600 text-white font-bold rounded`}>
        -{discount}%
      </span>
    </div>
  )
}
