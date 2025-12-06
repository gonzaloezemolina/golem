import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AdminSidebar from "@/components/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar userName={session.user?.name || "Admin"} />
        
        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 ml-0 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}