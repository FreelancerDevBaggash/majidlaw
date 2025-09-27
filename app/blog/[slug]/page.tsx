// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation"
import { BlogPostContent } from "@/components/blog/blog-post-content"
import { BlogComments } from "@/components/blog/blog-comments"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog-data"
export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const data = await getBlogPostBySlug(params.slug)

    if (!data || !data.post) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground font-arabic text-lg">المقال غير موجود</p>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background">
        <BlogPostContent post={data.post} />
        {data.post._id && <BlogComments postId={data.post._id} />}
      </div>
    )
  } catch (error) {
    console.error('Error loading blog post:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-arabic text-lg">حدث خطأ أثناء تحميل المقال</p>
      </div>
    )
  }
}

// Static Generation مع Fallback
export async function generateStaticParams() {
  try {
    if (process.env.NODE_ENV === 'production') {
      const data = await getBlogPosts(1, 100)
      return data.posts.map((post) => ({
        slug: post.slug,
      }))
    }
    return []
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// إعلام Next.js أن الصفحات غير المولدة ستتم معالجتها عند الطلب
export const dynamicParams = true

// إعادة التحقق كل ساعة (اختياري)
export const revalidate = 3600
