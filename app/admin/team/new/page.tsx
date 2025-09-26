"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { TeamMemberForm } from "@/components/admin/team-member-form"

export default function NewTeamMemberPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const memberId = searchParams.get('id')

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 lg:ml-64 p-6">
            <div className="max-w-7xl mx-auto">
              <TeamMemberForm />
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}