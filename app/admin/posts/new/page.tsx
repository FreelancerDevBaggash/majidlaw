import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import AddPostPage from "@/components/admin/post-editor"

export default function NewPostPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 lg:mr-64 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold font-arabic">مقال جديد</h1>
                <p className="text-muted-foreground font-arabic">إنشاء مقال جديد للمدونة</p>
              </div>
              <AddPostPage />
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
