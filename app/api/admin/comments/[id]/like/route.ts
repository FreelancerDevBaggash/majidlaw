import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Comment from "@/models/Comment"

export const dynamic = "force-dynamic"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: "معرف التعليق مطلوب" }, 
        { status: 400 }
      )
    }

    // إنشاء معرف فريد للمستخدم (في تطبيق حقيقي، استخدم authentication)
    const ip = request.ip || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const userIdentifier = `${ip}-${userAgent}`.slice(0, 100) // تقليل الطول

    const comment = await Comment.findById(id)
    if (!comment) {
      return NextResponse.json(
        { error: "التعليق غير موجود" }, 
        { status: 404 }
      )
    }

    // تهيئة الحقول إذا لم تكن موجودة
    if (!comment.likes) {
      comment.likes = []
    }
    if (!comment.likesCount) {
      comment.likesCount = 0
    }

    // التحقق إذا كان المستخدم قد أعجب بالتعليق مسبقاً
    const hasLiked = comment.likes.includes(userIdentifier)

    let updatedComment
    if (hasLiked) {
      // إزالة الإعجاب
      updatedComment = await Comment.findByIdAndUpdate(
        id,
        { 
          $pull: { likes: userIdentifier },
          $inc: { likesCount: -1 }
        },
        { new: true }
      )
    } else {
      // إضافة إعجاب
      updatedComment = await Comment.findByIdAndUpdate(
        id,
        { 
          $addToSet: { likes: userIdentifier },
          $inc: { likesCount: 1 }
        },
        { new: true }
      )
    }

    return NextResponse.json({
      success: true,
      likesCount: updatedComment?.likesCount || 0,
      hasLiked: !hasLiked
    })
  } catch (error) {
    console.error("Like comment error:", error)
    return NextResponse.json(
      { error: "خطأ في تحديث الإعجاب" }, 
      { status: 500 }
    )
  }
}