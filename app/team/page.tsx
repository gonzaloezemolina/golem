import Image from "next/image"
import Link from "next/link"

// Mock team data
const teamMembers = [
  {
    id: 1,
    name: "Gonzalo Molina",
    role: "Fundador",
    image: "/Gonza.jpeg",
  },
  {
    id: 2,
    name: "Marcos Iantosca",
    role: "Fundador",
    image: "/marcos.jpg",
  },
  {
    id: 3,
    name: "Lucas Henderickx",
    role: "Fundador",
    image: "/lucas.png",
  },
]

export default function Team() {
  return (
    <>
      {/* Banner Section */}
      <section className="relative bg-black text-white py-20 md:py-32 overflow-hidden bg-[url('/cesped.png')] bg-cover bg-center bg-no-repeat">
        {/* Background decorative element */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="0" x2="1200" y2="400" stroke="#d3b05c" strokeWidth="1" opacity="0.3" />
            <line x1="100" y1="0" x2="1200" y2="300" stroke="#d3b05c" strokeWidth="1" opacity="0.3" />
            <line x1="200" y1="0" x2="1200" y2="200" stroke="#d3b05c" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">EQUIPO</h1>
        </div>
      </section>

      {/* Team Members Grid Section */}
      <section className="bg-fondo text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-gray-400 text-sm md:text-base mb-3">Nuestro equipo</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">PRINCIPALES JUGADORES</h2>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:scale-105"
              >
                {/* Team Member Image */}
                <div className="relative h-80 md:h-96 bg-gray-900 rounded-lg overflow-hidden border border-highlight/20 group-hover:border-highlight/60 transition-all duration-300">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Team Member Info */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl md:text-2xl font-bold group-hover:text-highlight transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


       {/* About Us Section */}
      <section className="text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* About Us Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-16 md:mb-24">
            {/* Left Side - Text Content */}
            <div className="flex flex-col gap-6">
              {/* Tag */}
              <div className="inline-flex">
                <span className="px-4 py-2 border border-highlight text-sm font-semibold text-white w-fit">
                  QUIÉNES SOMOS
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
                PENSADO PARA TODOS
              </h2>

              {/* Description */}
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Queremos que cada persona se sienta parte del deporte que practiqué desde el primer momento. 
La accesibilidad, innovación y el detalle son nuestras bases. Pensado para todos y también para aquellos que buscan superarse e ir más allá.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href={'https://www.instagram.com/golem.rosario/'} target="blank">
                
               
                <button className="px-8 cursor-pointer py-4 bg-highlight text-black font-semibold hover:bg-highlight/90 transition-all duration-300 flex items-center justify-center gap-2 group">
                  NUESTRAS REDES
                  <i className="bi bi-chevron-right"></i>
                </button>
                 </Link>
                <a
                  href="/golem-catalog.pdf"
                  download
                  className="px-8 py-4 border-2 border-highlight text-highlight hover:bg-highlight hover:text-[#74d4ff] transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
                >
                  SABER MÁS
                  <i className="bi bi-download"></i>
                </a>
              </div>
            </div>

            {/* Right Side - Logo */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-48 h-48 md:w-64 md:h-64 lg:w-82 lg:h-82 rounded-2xl overflow-hidden transition-all duration-300 flex items-center justify-center">
                <Image
                  src="/Golem.png"
                  alt="Golem Logo"
                  width={288}
                  height={288}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Brands Section */}
          {/* <div className="border-t border-highlight/20 pt-12 md:pt-16">
            <h3 className="text-center text-xl md:text-2xl font-text mb-8 md:mb-12">Confían en nosotros</h3>

            {/* Brands Grid - Responsive */}
            {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((brand) => (
                <div
                  key={brand}
                  className="flex items-center justify-center h-24 md:h-28 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-highlight/40 hover:bg-gray-900/80 transition-all duration-300"
                >
                  <Image
                    src={`/ ${brand}`}
                    alt={`Brand ${brand}`}
                    width={120}
                    height={80}
                    className="w-auto h-12 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div> */} 
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cover bg-center bg-no-repeat text-white py-16 md:py-24 relative overflow-hidden">
        {/* Decorative accent elements */}
        <div className="absolute top-10 right-10 w-3 h-3 bg-highlight/40 transform rotate-45" />
        <div className="absolute bottom-10 left-1/4 w-3 h-3 bg-highlight/40 transform rotate-45" />
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-highlight/40 transform rotate-45" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            {"Formá parte del"} <span className="text-highlight">equipo</span>
          </h2>
          <p className="mb-6 font-text">¿Te interesa unirte al proyecto?</p>

              <Link href="/contact">
              
          <button className="inline-flex items-center cursor-pointer gap-3 px-8 py-4 border border-highlight text-highlight font-semibold hover:bg-highlight hover:text-[#74d4ff] transition-all duration-300 group">
            Contáctanos <i className="bi bi-chevron-right group-hover:translate-x-1 transition-transform"></i>
            {/* <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg> */}
          </button>
              </Link>
        </div>
      </section>
    </>
  )
}
