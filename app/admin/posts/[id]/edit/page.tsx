import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import PostEditor from "@/components/admin/post-editor"
import BlogPostModel, { IBlogPost } from "@/models/BlogPost"
import { notFound } from "next/navigation"

interface EditPostPageProps {
  params: { id: string }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await BlogPostModel.findById(params.id).lean()

  if (!post) {
    notFound()
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold font-arabic">تحرير المقال</h1>
            <p className="text-muted-foreground font-arabic">تحرير: {post.title}</p>
          </div>
          <PostEditor post={post} />
        </div>
      </div>
    </AdminGuard>
  )
}
