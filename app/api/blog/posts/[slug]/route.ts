// app/api/blog/posts/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // الاتصال بقاعدة البيانات
    await connectDB()

    // البحث عن المقال المطلوب
    const post = await BlogPost.findOne({ 
      slug: params.slug,
      published: true 
    }).lean()

    if (!post) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 })
    }

    // جلب مقالات ذات صلة حسب نفس التصنيف (يمكن تعديل المنطق حسب الحاجة)
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id }, // استبعاد المقال الحالي
      category: post.category,
      published: true
    })
      .limit(3)
      .lean()

    // إرجاع البنية المتوقعة
    return NextResponse.json({ post, relatedPosts })
  } catch (error) {
    console.error("Get blog post error:", error)
    return NextResponse.json({ error: "خطأ في جلب المقال" }, { status: 500 })
  }
}
