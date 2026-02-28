import Image from "next/image";
import Link from "next/link";
import Features from "@/components/features";
import { getFeaturedProducts, getNewProducts } from "./data/featured-products";

export const revalidate = 60

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  const newProducts = await getNewProducts()

  return (
    <>
      {/* Hero Section with Video */}
      <section className="bg-black text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-golem font-bold text-balance">
                AQUEL QUE VA MÁS ALLÁ
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Deporte y fitness en una sola tienda. <br />
                Encontrá todo lo que necesitás para aumentar tu rendimiento al máximo.
              </p>
              
              <Link href="/products">
                <button className="w-fit cursor-pointer px-8 py-3 bg-highlight text-white font-bold hover:bg-highlight/80 transition-colors">
                  IR A LA TIENDA
                </button>
              </Link>
            </div>

            <div className="relative h-64 md:h-96 bg-gray-900 rounded overflow-hidden">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source
                  src="https://res.cloudinary.com/dmfkhycen/video/upload/v1766974929/VIDEO_DE_PRUEBA_HERO_r6pvpj.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ PRODUCTOS DESTACADOS */}
      {featuredProducts.length > 0 && (
        <section className="bg-black text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              PRODUCTOS DESTACADOS
            </h2>
            <div className="w-40 h-1 bg-highlight mb-12"></div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product: any) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <div className="group transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="relative h-64 md:h-72 overflow-hidden">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4 md:p-6">
                      <p className="text-highlight text-sm font-semibold mb-2">
                        {product.category}
                      </p>
                      <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-highlight transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-highlight">
                          ${parseFloat(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🆕 NUEVOS INGRESOS */}
      {newProducts.length > 0 && (
        <section className="bg-black text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              NUEVOS INGRESOS
            </h2>
            <div className="w-40 h-1 bg-highlight mb-12"></div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {newProducts.map((product: any) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <div className="group transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="relative h-64 md:h-72  overflow-hidden">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Badge "NUEVO" */}
                      <div className="absolute top-2 right-2 bg-highlight text-black px-3 py-1 text-xs font-bold rounded">
                        NUEVO
                      </div>
                    </div>

                    <div className="p-4 md:p-6">
                      <p className="text-highlight text-sm font-semibold mb-2">
                        {product.category}
                      </p>
                      <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-highlight transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-highlight">
                          ${parseFloat(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      <section className="bg-fondo text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl">
                  <Image src="/gym.jpg" alt="Running Equipment" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl">
                  <Image src="/padel.jpg" alt="Sports Watch" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="relative col-span-2 h-40 md:h-48 rounded-2xl overflow-hidden shadow-2xl">
                  <Image src="/botines.jpg" alt="Sports Headphones" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-highlight/5 rounded-full blur-3xl"></div>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-highlight text-sm font-semibold mb-3 uppercase tracking-wider">
                  Nuestro equipo
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                  PENSADO PARA TODOS
                </h2>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                  Buscamos que el deporte sea accesible, real y sin vueltas. Elegimos productos que usaríamos nosotros, con una idea clara: acompañarte en cada jugada.
                </p>
              </div>

              <Link href="/team">
                <button className="w-fit cursor-pointer px-8 py-3 bg-highlight text-white font-bold hover:bg-highlight/80 transition-colors">
                  CONÓCENOS
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Features />
    </>
  )
}