import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
        className={`${geistInter.variable} bg-red-300 bg-cover bg-center bg-no-repeat`}
      >
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Header/>
        {children}
        <Footer/>
        <WhatsAppButton/>
      </body>
    </html>
  );
}
