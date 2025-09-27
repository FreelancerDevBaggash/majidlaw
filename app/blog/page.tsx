import { Suspense } from "react"
import { BlogHeader } from "@/components/blog/blog-header"
import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogSearch } from "@/components/blog/blog-search"
import { BlogCategories } from "@/components/blog/blog-categories"
export const dynamic = "force-dynamic";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <BlogSearch />
            <BlogCategories />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="text-center py-8">جاري التحميل...</div>}>
              <BlogGrid />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
