"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  color: string;
  inStock: boolean;
  slug: string; // ← Agregá esto
}

interface CatalogGridProps {
  products: Product[]; // ← Recibe productos como prop
}

export default function CatalogGrid({ products }: CatalogGridProps) {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 1000],
    brands: [] as string[],
    colors: [] as string[],
    onlyInStock: false,
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = filters.categories.length === 0 || filters.categories.includes(product.category);
      const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const brandMatch = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const colorMatch = filters.colors.length === 0 || filters.colors.includes(product.color);
      const stockMatch = !filters.onlyInStock || product.inStock;

      return categoryMatch && priceMatch && brandMatch && colorMatch && stockMatch;
    });
  }, [filters, products]);

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">Catálogo</h1>
        <p className="text-gray-400">{filteredProducts.length} productos disponibles</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`} // ← Agregá el Link
            className="group border border-highlight/20 hover:border-highlight/60 transition-all duration-300 bg-black overflow-hidden relative block"
          >
            {/* Product Image */}
            <div className="relative h-64 md:h-72 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Wishlist Heart */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // ← Evitar que el Link se active
                  toggleWishlist(product.id);
                }}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-highlight/80 rounded-full transition-all duration-300 z-10"
              >
                <Heart
                  size={20}
                  className={wishlist.includes(product.id) ? "fill-highlight text-highlight" : "text-white"}
                />
              </button>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => e.preventDefault()} // ← Evitar que el Link se active
                className="absolute bottom-4 right-4 p-3 bg-highlight text-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-highlight/80"
              >
                <ShoppingCart size={20} />
              </button>

              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold">Sin Stock</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 md:p-6">
              <p className="text-highlight text-sm font-semibold mb-2">{product.category}</p>
              <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-highlight transition-colors">
                {product.name}
              </h3>
              <span className="text-2xl font-bold text-highlight">${product.price}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No hay productos que coincidan con tus filtros.</p>
        </div>
      )} */}
    </div>
  );
}