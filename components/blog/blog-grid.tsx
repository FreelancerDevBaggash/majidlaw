// components/blog/blog-grid.tsx
import { getBlogPosts } from "@/lib/blog-data"
import { BlogCard } from "./blog-card"

interface BlogGridProps {
  search?: string
  category?: string
  page?: number
}

// مكون للبيانات فقط
async function BlogGridContent({ search = "", category = "", page = 1 }: BlogGridProps) {
  const data = await getBlogPosts(page, 10, search, category)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-arabic text-foreground">
          {category ? `مقالات في: ${category}` : "أحدث المقالات"}
        </h2>
        <span className="text-muted-foreground">{data.pagination.total} مقال</span>
      </div>

      {data.posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-arabic text-lg">
            {search || category ? "لا توجد مقالات تطابق معايير البحث" : "لا توجد مقالات متاحة حالياً"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>

          {data.pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                <a
                  key={pageNum}
                  href={`?page=${pageNum}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}`}
                  className={`px-3 py-1 rounded-md border ${
                    pageNum === page
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-accent'
                  } font-arabic`}
                >
                  {pageNum}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// مكون الـ Fallback للتحميل
function BlogGridFallback() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-arabic text-foreground">أحدث المقالات</h2>
        <span className="text-muted-foreground animate-pulse">جاري التحميل...</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6 animate-pulse">
            <div className="h-48 bg-muted rounded-md mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-full mb-1"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// المكون الرئيسي
export function BlogGrid(props: BlogGridProps) {
  return (
    <BlogGridContent {...props} />
  )
}

// تصدير الـ Fallback للاستخدام مع Suspense
export { BlogGridFallback }