import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "INFORMACIÓN",
      links: [
        { name: "Shop All", href: "#" },
        { name: "New Arrivals", href: "#" },
        { name: "Best Sellers", href: "#" },
      ],
    },
    {
      title: "TIENDA",
      links: [
        { name: "About Us", href: "#" },
        { name: "Equipo", href: "/team" },
        { name: "Contacto", href: "/contact" },
      ],
    },
    {
      title: "NOSOTROS",
      links: [
        { name: "Contact Us", href: "#" },
        { name: "FAQ", href: "#" },
        { name: "Shipping Info", href: "#" },
      ],
    },
    {
      title: "RECURSOS",
      links: [
        { name: "Blog", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
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
                  <Icon size={18} />
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
