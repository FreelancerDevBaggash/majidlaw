import { notFound } from "next/navigation"
import { BlogPostContent } from "@/components/blog/blog-post-content"
import { BlogComments } from "@/components/blog/blog-comments"
import { blogPosts } from "@/lib/blog-data"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogPostContent post={post} />
      <BlogComments postId={post.id} />
    </div>
  )
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}
