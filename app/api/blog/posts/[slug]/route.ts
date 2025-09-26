// app/api/blog/posts/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const post = await BlogPost.findOne({ 
      slug: params.slug,
      published: true 
    }).lean()

    if (!post) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Get blog post error:", error)
    return NextResponse.json({ error: "خطأ في جلب المقال" }, { status: 500 })
  }
}