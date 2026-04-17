"use client"

import Image from "next/image"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import PriceDisplay from "@/components/price-display"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface Product {
  id: string | number
  slug: string
  image_url: string
  name: string
  category: string
  price: string | number
  on_sale?: boolean
  sale_price?: number | string | null
}

export default function FeaturedProductsCarousel({ products }: { products: Product[] }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
      className="featured-swiper pb-12"
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <Link href={`/products/${product.slug}`}>
            <div className="group transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="relative h-64 md:h-72 overflow-hidden">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.on_sale && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded">
                    PRECIO ESPECIAL
                  </div>
                )}
              </div>

              <div className="p-4 md:p-6">
                <p className="text-highlight text-sm font-semibold mb-2">
                  {product.category}
                </p>
                <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-highlight transition-colors">
                  {product.name}
                </h3>
                <PriceDisplay
                  price={product.price}
                  salePrice={product.sale_price}
                  onSale={product.on_sale}
                  size="md"
                />
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
