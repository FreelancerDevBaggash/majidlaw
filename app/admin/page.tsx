import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <AdminHeader />
        <div className="flex flex-1 pt-16">
          <AdminSidebar />
          <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 ml-0 lg:ml-64 w-full max-w-full overflow-x-auto">
            <div className="max-w-8xl mx-auto w-full">
              <AdminDashboard />
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}