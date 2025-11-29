import { fetchProductBySlug, fetchRelatedProducts } from "@/app/data/data"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Truck } from "lucide-react"
import ProductDetailClient from "@/components/product-detail-client"
import ProductImageGallery from "@/components/product-image-gallery"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)

  if (!product) {
    notFound()
  }

    // Obtener productos relacionados
  const relatedProducts = product.subcategory_id 
    ? await fetchRelatedProducts(product.id, product.subcategory_id, 4)
    : []

  // Filtrar imágenes que existen
  const images = [
    product.image_url,
    product.image_2,
    product.image_3,
    product.image_4,
    product.image_5
  ].filter(Boolean) as string[]

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
          {/* COLUMNA IZQUIERDA - IMÁGENES */}
        <ProductImageGallery images={images} productName={product.name} />

          {/* COLUMNA DERECHA - INFO */}
          <div className="flex flex-col gap-6">
            {/* Brand and Product Title */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-highlight rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {product.brand?.charAt(0) || 'G'}
                  </div>
                  <span className="text-sm font-semibold">{product.brand}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            </div>

            {/* Price */}
            <div className="border-b border-highlight/20 pb-6">
              <p className="text-3xl md:text-4xl font-bold text-highlight">
                ${Number(product.price)}
              </p>
            </div>

            {/* COMPONENTE CLIENTE - Selector de talle y botones */}
            <ProductDetailClient product={product} />

            {/* Shipping Info */}
            <div className="border border-highlight/20 rounded-lg p-4 flex items-start gap-3">
              <Truck size={20} className="text-highlight flex-shrink-0 mt-1" />
              <div className="text-sm">
                <p className="font-semibold">Delivery gratis en compras en la ciudad de Rosario</p>
                <p className="text-gray-400 text-xs mt-1">Tiempo de entrega estimado 1-2 días hábiles</p>
              </div>
            </div>

            {/* Stock Info */}
            <div className="text-sm text-gray-400">
              <p>
                Stock total disponible:{" "}
                <span className="text-highlight font-semibold">
                  {product.total_stock} unidades
                </span>
              </p>
              {product.available_sizes && product.available_sizes.length > 0 && (
                <p className="text-xs mt-1">
                  Talles disponibles: {product.available_sizes.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="py-12 md:py-16 mt-2">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">PRODUCTOS RELACIONADOS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group border border-highlight/20 hover:border-highlight transition-all overflow-hidden"
                >
                  <div className="relative h-48 bg-stone-900 overflow-hidden">
                    <Image
                      src={relatedProduct.image_url || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-highlight text-sm font-semibold mb-1">
                      {relatedProduct.category}
                    </p>
                    <h3 className="font-bold mb-3 line-clamp-2 group-hover:text-highlight transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-highlight font-bold">
                      ${Number(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}