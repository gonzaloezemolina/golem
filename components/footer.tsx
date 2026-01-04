import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"

const TikTok = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  className="hover:text-sky-300">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "NOSOTROS",
      links: [
        { name: "Shop All", href: "#" },
        { name: "New Arrivals", href: "#" },
        { name: "Best Sellers", href: "#" },
      ],
    },
    {
      title: "TIENDA",
      links: [
        { name: "Catálogo", href: "/products" },
        { name: "Equipo", href: "/team" },
        { name: "Contacto", href: "/contact" },
      ],
    },
    {
      title: "INFORMACIÓN",
      links: [
        { name: "Rosario, Bv. Oroño 3614", href: "#" },
        { name: "+54 9 341-562-1921", href: "#" },
        { name: "Terminos y condiciones", href: "terminos-y-condiciones" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: TikTok, href: "#", label: "TikTok" },
  ]

  return (
    <footer className="bg-black text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Logo and sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo section */}
          <div className="col-span-1">
            <h3 className="text-lg md:text-xl font-bold mb-2">GOLEM</h3>
            <p className="text-gray-400 text-sm">Aquel que va más allá</p>
          </div>

          {/* Footer links sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="text-xs md:text-sm font-bold tracking-wider mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-highlight transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-highlight hover:text-highlight transition-colors duration-300"
                >
                  <Icon size={18} className="hover:text-sky-300" />
                </Link>
              )
            })}
          </div>

          {/* Copyright text */}
          <p className="text-gray-500 text-sm text-center">© {currentYear} Golem. Desarrollado por Grupo Golem.</p>
        </div>
      </div>
    </footer>
  )
}
