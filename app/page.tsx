import Image from "next/image";
import { fetchProducts } from "./data/data";
import Link from "next/link";
import Features from "@/components/features";

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
      <section className="bg-black text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
            {/* Left Content */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-golem font-bold text-balance">AQUEL QUE VA MÁS ALLÁ</h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Deporte y fitness en una sola tienda. <br />
                Encontrá todo lo que necesitás para aumentar tu rendimiento al máximo.
              </p>
              
             
              <button className="w-fit cursor-pointer px-8 py-3 bg-highlight text-white font-bold hover:bg-highlight/80 transition-colors">
                 <Link href="/products" className="w-full h-full">IR A LA TIENDA</Link>
              </button>
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


      {/* Featured False Products Section */}
       <section className="bg-black text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">PRODUCTOS DESTACADOS</h2>
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

      
      {/* Featured False Products Section */}
       <section className="bg-black text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">NUEVOS INGRESOS</h2>
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

      

      {/* Recommendations Section */}
      <section className="bg-fondo text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Images Grid */}
            <div className="relative">
              {/* Main Grid Container */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                {/* Large Image - Top Left */}
                <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl">
                  <Image src="/gym.jpg" alt="Running Equipment" fill className="object-cover" />
                </div>

                {/* Small Image - Top Right */}
                <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl hover:scale">
                  <Image src="/padel.jpg" alt="Sports Watch" fill className="object-cover" />
                </div>

                {/* Wide Image - Bottom spanning both columns */}
                <div className="relative col-span-2 h-40 md:h-48 rounded-2xl overflow-hidden shadow-2xl">
                  <Image src="/botines.jpg" alt="Sports Headphones" fill className="object-cover" />
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-highlight/5 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8">
              <div>
                <p className="text-highlight text-sm font-semibold mb-3 uppercase tracking-wider">Nuestro equipo</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                  PENSADO PARA TODOS
                </h2>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                  Buscamos que el deporte sea accesible, real y sin vueltas. Elegimos productos que usaríamos nosotros, con una idea clara: acompañarte en cada jugada.
                </p>
              </div>

            <Link href={'/team'}>
              <button className="w-fit cursor-pointer px-8 py-3 bg-highlight text-white font-bold hover:bg-highlight/80 transition-colors">CONÓCENOS</button>
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Features Section */}
      <Features/>
    </>
  );
}
