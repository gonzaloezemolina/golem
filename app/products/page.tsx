import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "../data/data";
import { Heart, ShoppingCart } from "lucide-react";
import AddToCartButton from "@/components/addToCartButton";

export default async function productsPage () {
    const products = await fetchProducts();

    if (!products || products.length === 0) {
        return <h1>No hay productos disponibles</h1>;
    }

    return(
     <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Catálogo</h1>
        <p className="text-gray-400">{products.length} productos disponibles</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group border border-highlight/20 hover:border-highlight/60 transition-all duration-300 bg-black overflow-hidden relative"
          >
            {/* Product Image */}
                 <Link href={`/products/${product.slug}`}>
              
            <div className="relative h-64 md:h-72 bg-gray-900 overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Add to Cart Button (appears on hover) */}
              <button className="absolute bottom-4 right-4 p-3 bg-highlight text-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-highlight/80 transform group-hover:translate-y-0 translate-y-2">
                <ShoppingCart size={20} />
              </button>

              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold">Sin Stock</span>
                </div>
              )}
            </div>
                    </Link>
            {/* Product Info */}
            <div className="p-4 md:p-6">
              <p className="text-highlight text-sm font-semibold mb-2">{product.category}</p>
              <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-highlight transition-colors line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-highlight">${parseFloat(product.price).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No hay productos que coincidan con tus filtros.</p>
        </div>
      )}
    </div>
    )
}