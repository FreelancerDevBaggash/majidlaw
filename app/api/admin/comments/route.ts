import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Comment from "@/models/Comment"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

// دالة التحقق من البريد الإلكتروني
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = request.nextUrl
    const postId = searchParams.get("postId")
    const approved = searchParams.get("approved")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // التحقق من صحة المدخلات
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "معاملات التصفح غير صالحة" },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    // بناء الاستعلام
    const query: any = {}
    if (postId) query.postId = postId
    if (approved !== null) {
      query.approved = approved === "true"
    }

    // التصنيف
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

    const comments = await Comment.find(query)
      .populate({ 
        path: "postId", 
        select: "title slug excerpt",
        match: { published: true }
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    // تصفية التعليقات التي لا ترتبط بمقال منشور
    const filteredComments = comments.filter((comment: any) => comment.postId !== null)

    const total = await Comment.countDocuments(query)
    const approvedCount = await Comment.countDocuments({ ...query, approved: true })
    const pendingCount = await Comment.countDocuments({ ...query, approved: false })

    return NextResponse.json({
      success: true,
      comments: filteredComments,
      stats: {
        total,
        approved: approvedCount,
        pending: pendingCount
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
    })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json(
      { error: "خطأ في جلب التعليقات" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // التحقق من معدل الطلبات
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const limiter = rateLimit({ interval: 60 * 1000 })
    const isAllowed = await limiter.check(ip, 5)

    if (!isAllowed) {
      return NextResponse.json(
        { error: "لقد تجاوزت الحد المسموح به من الطلبات. حاول مرة أخرى بعد دقيقة." },
        { status: 429 }
      )
    }

    await connectDB()
    const body = await request.json()
    const { postId, name, email, content, parentId, postTitle } = body

    // التحقق من الحقول المطلوبة
    if (!postId || !name || !email || !content) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" }, 
        { status: 400 }
      )
    }

    // التحقق من صحة البريد الإلكتروني
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صالح" },
        { status: 400 }
      )
    }

    // التحقق من طول المحتوى
    if (content.length < 5) {
      return NextResponse.json(
        { error: "التعليق يجب أن يكون على الأقل 5 أحرف" },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "التعليق يجب ألا يتجاوز 1000 حرف" },
        { status: 400 }
      )
    }

    // التحقق من وجود parentId إذا تم إرساله
    if (parentId) {
      const parentComment = await Comment.findById(parentId)
      if (!parentComment) {
        return NextResponse.json(
          { error: "التعليق الأصلي غير موجود" },
          { status: 400 }
        )
      }
    }

    // التحقق من عدد التعليقات من نفس البريد الإلكتروني في آخر ساعة
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentComments = await Comment.countDocuments({
      email,
      createdAt: { $gte: oneHourAgo }
    })

    if (recentComments >= 3) {
      return NextResponse.json(
        { error: "يمكنك إرسال 3 تعليقات فقط في الساعة" },
        { status: 429 }
      )
    }

    // إنشاء التعليق
    const commentData: any = {
      postId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      content: content.trim(),
      approved: process.env.NODE_ENV === 'development',
      isAdmin: email.includes('@lawfirm.com') || name.includes('مدير')
    }

    if (parentId) {
      commentData.parentId = parentId
    }

    const comment = await Comment.create(commentData)

    return NextResponse.json(
      { 
        success: true, 
        comment,
        message: comment.approved 
          ? "تم إضافة تعليقك بنجاح" 
          : "تم إرسال تعليقك وسيظهر بعد المراجعة"
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error("Add comment error:", error)
    return NextResponse.json(
      { error: "خطأ في إضافة التعليق" }, 
      { status: 500 }
    )
  }
}