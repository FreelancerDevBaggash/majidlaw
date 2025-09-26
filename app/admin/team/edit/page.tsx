// app/admin/team/edit/page.tsx
"use client"

import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { TeamMemberForm } from "@/components/admin/team-member-form"

export default function EditTeamMemberPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background ">
        <AdminHeader />
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-6 lg:ml-64 mt-16 lg:mt-0">
          <TeamMemberForm />
        </main>
      </div>
    </AdminGuard>
  )
}