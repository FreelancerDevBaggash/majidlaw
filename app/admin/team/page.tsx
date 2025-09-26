"use client"

import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { TeamManagement } from "@/components/admin/team-management"

export default function AdminTeamPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 lg:ml-64 p-4 lg:p-6"> {/* تصحيح ml بدلاً من mr */}
            <TeamManagement />
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}