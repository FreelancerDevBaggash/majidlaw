// app/admin/cases/edit/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { CaseForm } from "@/components/admin/case-form"

export default function EditCasePage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        <AdminHeader />
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-6 lg:ml-64 mt-16 lg:mt-0">
          <CaseForm />
        </main>
      </div>
    </AdminGuard>
  )
}