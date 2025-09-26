// app/admin/cases/new/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { CaseForm } from "@/components/admin/case-form"

export default function NewCasePage() {
  return (
   <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 lg:ml-64 p-6">
            <div className="max-w-7xl mx-auto">
                        <CaseForm />
         </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
