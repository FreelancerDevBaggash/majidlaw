// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation"
import { BlogPostContent } from "@/components/blog/blog-post-content"
import { BlogComments } from "@/components/blog/blog-comments"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog-data"

interface BlogPostPageProps {
  params: { slug: string }
}

// ديناميكية حسب كل طلب
export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 3600 // إعادة التحقق كل ساعة

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const data = await getBlogPostBySlug(params.slug)

    if (!data) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-background">
        <BlogPostContent post={data.post} />
        <BlogComments postId={data.post._id} />
      </div>
    )
  } catch (error) {
    console.error('Error loading blog post:', error)
    notFound()
  }
}

// جلب بعض الـ slugs مسبقاً (اختياري)
export async function generateStaticParams() {
  if (process.env.NODE_ENV !== 'production') return []

  try {
    const data = await getBlogPosts(1, 100)
    return data.posts.map(post => ({ slug: post.slug }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
