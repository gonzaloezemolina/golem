import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// ADMIN HARD-CODED
const ADMIN_USER = {
  id: "1",
  name: "Admin Golem",
  email: "golemgrupo@gmail.com",
  password: "wanakin1", // PASSWORD EN TEXTO PLANO (TEMPORAL)
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Intento de login:", credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Faltan credenciales")
          return null
        }

        // Verificar email
        if (credentials.email !== ADMIN_USER.email) {
          console.log("❌ Email incorrecto")
          console.log("   Esperado:", ADMIN_USER.email)
          console.log("   Recibido:", credentials.email)
          return null
        }

        // Verificar password (TEMPORAL - sin hash)
        if (credentials.password !== ADMIN_USER.password) {
          console.log("❌ Password incorrecto")
          return null
        }

        console.log("✅ Login exitoso")
        return {
          id: ADMIN_USER.id,
          name: ADMIN_USER.name,
          email: ADMIN_USER.email,
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
}