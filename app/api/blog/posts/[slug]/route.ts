// app/api/blog/posts/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"

// اجعل الـ route ديناميكي بالكامل
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // الاتصال بقاعدة البيانات
    await connectDB();

    // البحث عن المقال المطلوب
    const post = await BlogPost.findOne({ 
      slug: params.slug,
      published: true 
    }).lean();

    if (!post) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
    }

    // جلب مقالات ذات صلة حسب نفس التصنيف
    // const relatedPosts = await BlogPost.find({
    //   _id: { $ne: post._id }, 
    //   category: post.category,
    //   published: true
    // })
    //   .limit(3)
    //   .lean();

    // إرجاع النتيجة
    return NextResponse.json({ post,  });
  } catch (error) {
    console.error("Get blog post error:", error);
    return NextResponse.json({ error: "خطأ في جلب المقال" }, { status: 500 });
  }
}
