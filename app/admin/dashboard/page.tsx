"use client"

import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <AdminHeader />

        {/* محتوى الصفحة */}
        <div className="flex flex-1">
          {/* Sidebar للعرض على الشاشات الكبيرة، وشرائح صغيرة للهواتف */}
          <aside
            className={`fixed inset-y-0 left-0 z-20 w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex-shrink-0`}
          >
            <AdminSidebar />
          </aside>

          {/* Overlay للشاشات الصغيرة عند فتح السايدبار */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-10 bg-black/30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 p-6 md:ml-64">
            {/* زر فتح Sidebar على الشاشات الصغيرة */}
            <div className="md:hidden mb-4">
              <Button variant="outline" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5 mr-2" /> القائمة
              </Button>
            </div>

            {/* لوحة التحكم */}
            <AdminDashboard />
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
