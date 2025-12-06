import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
        console.log("🔑 Password recibido:", credentials?.password)

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Faltan credenciales")
          return null
        }

        // VERIFICACIÓN TEMPORAL SIN HASH
        const VALID_EMAIL = "golemgrupo@gmail.com"
        const VALID_PASSWORD = "wanakin1" // PASSWORD EN TEXTO PLANO (SOLO PARA TESTING)

        if (credentials.email !== VALID_EMAIL) {
          console.log("❌ Email incorrecto")
          console.log("   Esperado:", VALID_EMAIL)
          console.log("   Recibido:", credentials.email)
          return null
        }

        if (credentials.password !== VALID_PASSWORD) {
          console.log("❌ Password incorrecto")
          console.log("   Esperado:", VALID_PASSWORD)
          console.log("   Recibido:", credentials.password)
          return null
        }

        console.log("✅ Login exitoso!")
        return {
          id: "1",
          name: "Admin Golem",
          email: VALID_EMAIL,
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

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }