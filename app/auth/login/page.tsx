"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // TODO: Replace with NextAuth signIn() when configured
      // const result = await signIn('credentials', {
      //   email,
      //   password,
      //   redirect: false,
      // })
      // if (!result?.ok) {
      //   setError('Invalid credentials')
      //   return
      // }
      // router.push('/dashboard')

      // Placeholder API call - remove when NextAuth is configured
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        setError("Credenciales incorrectas")
        return
      }

      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Left Section - Welcome with Diagonal Image */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        {/* Diagonal background image */}
        <div className="absolute inset-0 transform -skew-x-12 origin-top-left">
          <Image
            src="/fondo-login.jpg"
            alt="Welcome background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative flex items-center justify-center p-8 h-full">
          <div className="text-left max-w-md">
            <h1 className="text-5xl font-bold text-white mb-4">BIENVENIDO!</h1>
            <p className="text-gray-300 text-base leading-relaxed">
              Ingresa en tu cuenta para ver tus productos en venta o para ver tu historial de compra.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="md:hidden mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Ingresa</h1>
            <p className="text-gray-400">Welcome back to Golem</p>
          </div>

          {/* Desktop header */}
          <div className="hidden md:block mb-8">
            <h2 className="text-3xl font-bold text-white">Ingresa tu cuenta</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="p-4 rounded bg-red-500/10 border border-red-500/50 text-red-400 text-sm">{error}</div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="leo@messi.com"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-colors"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            {/* Sign In button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-highlight cursor-pointer hover:bg-highlight/90 disabled:bg-highlight/50 text-black font-bold rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <p className="text-gray-400 text-sm">No tienes cuenta?</p>
            <Link
              href="/auth/signup"
              className="text-highlight hover:text-highlight/80 font-semibold text-sm transition-colors"
            >
              Registrate
            </Link>
          </div>

          {/* Forgot password link */}
          <div className="mt-4 text-center">
            <Link href="/auth/forgot-password" className="text-gray-400 hover:text-highlight text-sm transition-colors">
              Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
