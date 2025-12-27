import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

// ⭐ SOLO exportar GET y POST
export { handler as GET, handler as POST }