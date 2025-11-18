import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp";

const geistInter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Golem",
  description: "Todos los deportes en un solo estadio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistInter.variable} bg-red bg-cover bg-center bg-no-repeat`}
      >
        <Header/>
        {children}
        <Footer/>
        <WhatsAppButton/>
      </body>
    </html>
  );
}
