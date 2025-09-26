// components/blog-categories.tsx
import { Badge } from "@/components/ui/badge"
import { getBlogCategories } from "@/lib/blog-data"
import Link from "next/link"

interface BlogCategoriesProps {
  selectedCategory?: string
}

export async function BlogCategories({ selectedCategory }: BlogCategoriesProps) {
  try {
    const categories = await getBlogCategories()

    return (
      <div className="bg-card p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-arabic">التصنيفات</h3>
          {selectedCategory && (
            <Link 
              href="/blog"
              className="text-xs text-primary hover:underline font-arabic"
            >
              إلغاء التصفية
            </Link>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground font-arabic">
              لا توجد تصنيفات متاحة
            </p>
          ) : (
            categories.map((category) => (
              <Link 
                key={category.name} 
                href={
                  selectedCategory === category.name 
                    ? "/blog" 
                    : `/blog?category=${encodeURIComponent(category.name)}`
                }
              >
                <Badge
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  className="font-arabic cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category.name} ({category.count})
                </Badge>
              </Link>
            ))
          )}
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-bold font-arabic mb-4">التصنيفات</h3>
        <p className="text-sm text-muted-foreground font-arabic">
          حدث خطأ في تحميل التصنيفات
        </p>
      </div>
    )
  }
}