// components/blog/blog-grid.tsx
import { getBlogPosts } from "@/lib/blog-data";
import { BlogCard } from "./blog-card";

interface BlogGridProps {
  search?: string;
  category?: string;
  page?: number;
}

export const dynamic = "force-dynamic"; // مهم: يمنع الـ static generation

export default async function BlogGrid({ search = "", category = "", page = 1 }: BlogGridProps) {
  try {
    const currentPage = Number(page) || 1;
    const data = await getBlogPosts(currentPage, 10, search, category);

    if (!data?.posts?.length) {
      return (
        <div className="text-center py-12 text-muted-foreground font-arabic text-lg">
          {search || category ? "لا توجد مقالات تطابق معايير البحث" : "لا توجد مقالات متاحة حالياً"}
        </div>
      );
    }

    const totalPages = data.pagination?.pages || 1;

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-arabic text-foreground">
            {category ? `مقالات في: ${category}` : "أحدث المقالات"}
          </h2>
          <span className="text-muted-foreground">{data.pagination?.total || 0} مقال</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.posts.map(post => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <a
                key={pageNum}
                href={`?page=${pageNum}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}`}
                className={`px-3 py-1 rounded-md border ${
                  pageNum === currentPage
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-accent'
                } font-arabic`}
              >
                {pageNum}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("BlogGrid error:", error);
    return <div className="text-center py-12 text-red-500 font-arabic">خطأ في جلب المقالات</div>;
  }
}
