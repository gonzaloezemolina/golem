"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

// Importar estilos de Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomedStates, setZoomedStates] = useState<boolean[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Solucionar bug de hidratación
  useEffect(() => {
    setIsMounted(true)
    // Inicializar estados de zoom (uno por cada imagen)
    setZoomedStates(new Array(images.length).fill(false))
  }, [images.length])

  // Forzar desbloqueo del scroll
  useEffect(() => {
    const isAnyZoomed = zoomedStates.some(z => z)
    if (!isAnyZoomed) {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [zoomedStates])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-square bg-stone-900 rounded-lg flex items-center justify-center border border-highlight/20">
        <p className="text-gray-500">Sin imágenes</p>
      </div>
    )
  }

  // No renderizar hasta que esté montado (evita duplicación)
  if (!isMounted) {
    return (
      <div className="relative w-full aspect-square bg-stone-900 rounded-lg overflow-hidden border border-highlight/20 animate-pulse">
        <div className="h-full w-full bg-gray-800" />
      </div>
    )
  }

  const handleZoomChange = (index: number, zoomed: boolean) => {
    const newStates = [...zoomedStates]
    newStates[index] = zoomed
    setZoomedStates(newStates)
    
    // Forzar restauración del scroll
    if (!zoomed) {
      setTimeout(() => {
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
      }, 10)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Carrusel Principal */}
      <div className="relative w-full aspect-square bg-transparent rounded-lg overflow-hidden border border-highlight/20">
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-full w-full product-swiper"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              {/* Desktop: Imagen con zoom */}
              <div className="hidden md:block h-full w-full relative">
                <ControlledZoom 
                  isZoomed={zoomedStates[i] || false}
                  onZoomChange={(zoomed) => handleZoomChange(i, zoomed)}
                >
                  <Image
                    src={img}
                    alt={`${productName} - imagen ${i + 1}`}
                    fill
                    className="object-cover cursor-zoom-in"
                    priority={i === 0}
                     quality={95}
                  />
                </ControlledZoom>
              </div>

              {/* Mobile: Imagen simple */}
              <div className="md:hidden relative h-full w-full">
                <Image
                  src={img}
                  alt={`${productName} - imagen ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                   quality={95}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Hint de zoom para desktop */}
        {!zoomedStates.some(z => z) && (
          <div className="hidden md:block absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded-lg pointer-events-none z-10 backdrop-blur-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Hacé clic para zoom
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails - Solo si hay más de 1 imagen */}
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[FreeMode, Navigation, Thumbs]}
          spaceBetween={12}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          className="thumbs-swiper w-full"
          breakpoints={{
            640: {
              slidesPerView: 5,
            },
            768: {
              slidesPerView: 6,
            },
          }}
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <button
                className={`
                  relative w-full cursor-pointer aspect-square rounded overflow-hidden border-2 transition-all
                  ${activeIndex === i 
                    ? 'border-highlight shadow-lg shadow-highlight/20' 
                    : 'border-highlight/20 hover:border-highlight/60'
                  }
                `}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}