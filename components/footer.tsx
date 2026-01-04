import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"

const TikTok = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/profile.php?id=61580113263169", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/golem.rosario", label: "Instagram" },
    { icon: TikTok, href: "https://tiktok.com/@golemrosario", label: "TikTok" },
  ]

  return (
    <footer className="bg-black text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* ⭐ GRID CENTRADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Logo section */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold mb-3">GOLEM</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Aquel que va más allá
            </p>
          </div>

          {/* ⭐ NOSOTROS - CON PÁRRAFO */}
          <div className="col-span-1">
            <h4 className="text-sm font-bold tracking-wider mb-4 text-white">
              NOSOTROS
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Somos un equipo apasionado por el deporte. Buscamos que cada producto que ofrecemos sea accesible para todos.
            </p>
          </div>

          {/* TIENDA */}
          <div className="col-span-1">
            <h4 className="text-sm font-bold tracking-wider mb-4 text-white">
              TIENDA
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-highlight transition-colors text-sm">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-400 hover:text-highlight transition-colors text-sm">
                  Equipo
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-highlight transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* INFORMACIÓN */}
          <div className="col-span-1">
            <h4 className="text-sm font-bold tracking-wider mb-4 text-white">
              INFORMACIÓN
            </h4>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">
                Rosario, Bv. Oroño 3614
              </li>
              <li>
                <a href="tel:+5493415621921" className="text-gray-400 hover:text-highlight transition-colors text-sm">
                  +54 9 341 562-1921
                </a>
              </li>
              <li>
                <Link href="/terminos-y-condiciones" className="text-gray-400 hover:text-highlight transition-colors text-sm">
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Social icons and copyright */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Social icons */}
          <div className="flex gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
            <a 
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-highlight hover:text-highlight transition-colors duration-300"
                  >
                  <Icon size={18} />
                </a>
              )
            })}
          </div>

          {/* Copyright text */}
          <p className="text-gray-500 text-sm text-center">
            © {currentYear} Golem. Desarrollado por Grupo Golem.
          </p>
        </div>
      </div>
    </footer>
  )
}