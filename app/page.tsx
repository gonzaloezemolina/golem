import Image from "next/image";
import { fetchProducts } from "./data/data";
import Link from "next/link";

export default async function Home() {

  async function fetchFalseProducts() {
  // Placeholder for your data/data.ts import
  return [
    {
      id: 1,
      name: "Headphones Pro",
      price: 299.99,
      image: "/sports-equipment-headphones.jpg",
      category: "Audio",
    },
    {
      id: 2,
      name: "Sports Watch",
      price: 199.99,
      image: "/sports-equipment-watch.jpg",
      category: "Wearables",
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 159.99,
      image: "/sports-shoes-running.jpg",
      category: "Footwear",
    },
    {
      id: 4,
      name: "Training Backpack",
      price: 129.99,
      image: "/sports-training-backpack.jpg",
      category: "Bags",
    },
  ]
}

const falseProducts = await fetchFalseProducts()

  const products = await fetchProducts();
  console.log(products);
  return (
    <>
        {/* Hero Section with Video */}
      <section className="bg-fondo text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
            {/* Left Content */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-golem font-bold text-balance">AQUEL QUE VA MÁS ALLÁ</h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Equipo de calidad premium para atletas que buscan excelencia. Descubre nuestra colección de productos
                deportivos de última generación.
              </p>
              
             
              <button className="w-fit cursor-pointer px-8 py-3 bg-highlight text-white font-bold hover:bg-highlight/80 transition-colors">
                 <Link href="/products" className="w-full h-full border-1 border-red-400">IR A LA TIENDA</Link>
              </button>
            </div>

            <div className="relative h-64 md:h-96 bg-gray-900 rounded overflow-hidden">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source
                  src="https://videos.pexels.com/video-files/3571562/3571562-sd_640_360_25fps.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>


      {/* Featured False Products Section */}
      <section className="bg-black text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Productos Destacados</h2>
          <div className="w-40 h-1 bg-highlight mb-12"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {falseProducts.map((product) => (
              <div
                key={product.id}
                className="group border border-highlight/20 hover:border-highlight/60 transition-all duration-300 overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative h-64 md:h-72 bg-gray-900 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 md:p-6">
                  <p className="text-highlight text-sm font-semibold mb-2">{product.category}</p>
                  <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-highlight transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-highlight">${product.price}</span>
                    <button className="px-4 py-2 bg-highlight text-black font-semibold hover:bg-highlight/80 transition-colors">
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
