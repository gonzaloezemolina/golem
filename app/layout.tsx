import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from "next/link";
import Script from "next/script";
import ConditionalLayout from "@/components/conditional-layout";

const geistInter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

// ⭐ SEO MEJORADO
export const metadata: Metadata = {
  title: {
    default: "Golem - Deportes y Fitness",
    template: "%s | GOLEM"
  },
  description: "Tienda online de deportes y fitness. Camisetas, shorts y accesorios de fútbol y gimnasio. Envío gratis a Rosario.",
  keywords: ["indumentaria deportiva", "camisetas de fútbol", "ropa deportiva", "golem", "deportes rosario", "fitness", "gimnasio"],
  authors: [{ name: "GOLEM" }],
  creator: "GOLEM",
  publisher: "GOLEM",
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://golem.com.ar",
    siteName: "Golem",
    title: "Golem - Deportes y Fitness",
    description: "Tienda online de deportes y fitness. Envío gratis a Rosario.",
    images: [
      {
        url: "/Logo-seo.png", // ⚠️ Necesitás crear esta imagen (1200x630px)
        width: 1200,
        height: 630,
        alt: "GOLEM Deportes y Fitness",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "GOLEM - Deportes y Fitness",
    description: "Tienda online de deportes y fitness. Envío gratis a Rosario.",
    images: ["/Logo-seo.png"],
  },

  // Otros
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    // ⚠️ Agregá después cuando tengas Google Search Console
    // google: "tu-codigo-de-verificacion",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-7SHYGC4MLH`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
             window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-7SHYGC4MLH');
            `,
          }}
        />
      </head>
      
      <body
        className={`${geistInter.variable} bg-red-300 bg-cover bg-center bg-no-repeat`}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}