import { fetchProductBySlug } from "@/app/data/data"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, Heart, Truck } from "lucide-react"
import AddToCartButton from "@/components/addToCartButton"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Breadcrumb */}
      <div>
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/products"
            className="text-highlight hover:text-highlight/80 transition-colors flex items-center gap-2"
          >
            <i className="bi bi-chevron-left"></i> Volver a productos
          </Link>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col gap-4">
            {/* Main Product Image */}
            <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden border border-highlight/20 hover:border-1 border-highlight">
              <Image
                src={product.image || '/chelsea.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className="flex-shrink-0 w-20 h-20 bg-gray-900 rounded border-2 border-highlight/20 hover:border-highlight transition-colors overflow-hidden"
                >
                  <Image
                    src={product.image || "/chelsea.jpg"}
                    alt={`${product.name} view ${i}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              <button className="flex-shrink-0 w-20 h-20 bg-gray-900 rounded border-2 border-highlight/20 hover:border-highlight transition-colors flex items-center justify-center text-sm text-gray-400">
                +4 more
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Brand and Product Title */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-highlight rounded-full flex items-center justify-center text-black font-bold text-sm">
                    G
                  </div>
                  <span className="text-sm font-semibold">{product.brand}</span>
                </div>
                {/* <span className="text-xs text-gray-400">SKU123456</span> */}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>

              {/* Rating and Reviews */}
              {/* <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-highlight text-highlight" />
                  ))}
                </div>
                <span className="text-sm text-gray-400">(47 reviews)</span>
              </div> */}
            </div>

            {/* Price */}
            <div className="border-b border-golden/20 pb-6">
              <p className="text-3xl md:text-4xl font-bold text-highlight">${parseFloat(product.price)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-4">Color</label>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-gray-400 rounded border-2 border-white hover:border-highlight transition-colors"></button>
                <button className="w-10 h-10 bg-gray-600 rounded border-2 border-highlight/20 hover:border-highlight transition-colors"></button>
                <button className="w-10 h-10 bg-black rounded border-2 border-highlight/20 hover:border-highlight transition-colors"></button>
              </div>
            </div>

            <div className="border-b border-highlight/20 pb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold">Size</label>
                <button className="text-xs text-highlight hover:text-highlight/80">Size guide</button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {["40.5", "41", "42", "43", "43.5", "44", "44.5", "45", "46"].map((size) => (
                  <button
                    key={size}
                    className="py-2 px-3 border border-highlight/20 rounded hover:border-highlight text-sm font-medium transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Description */}
            <div className="border-b border-highlight/20 pb-6">
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex gap-3">
              <AddToCartButton product={product} />
              {/* <button className="px-6 py-3 bg-black border-2 border-highlight/20 hover:border-highlight transition-colors">
                <Heart size={20} />
              </button> */}
            </div>

            {/* Shipping Info */}
            <div className="border-1 border-highlight rounded-lg p-4 flex items-start gap-3">
              <Truck size={20} className="text-highlight flex-shrink-0 mt-1" />
              <div className="text-sm">
                <p className="font-semibold">Delivery gratis en compras superiores a $100.000</p>
                <p className="text-gray-400 text-xs mt-1">Tiempo de entrega estimado 3-5 días hábiles</p>
              </div>
            </div>

            {/* Stock Info */}
            <div className="text-sm text-gray-400">
              <p>
                Stock disponible: <span className="text-highlight font-semibold">{product.stock} unidades</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="bg-gray-900 border-t border-highlight/20 py-12 md:py-16 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border border-highlight/20 hover:border-highlight transition-colors overflow-hidden"
              >
                <div className="relative h-48 bg-gray-800">
                  <Image
                    src={`/chelsea.jpg${i}`}
                    alt={`Related product ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-highlight text-sm font-semibold mb-1">Sports Gear</p>
                  <h3 className="font-bold mb-3">Product Name {i}</h3>
                  <p className="text-highlight font-bold">$99.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
