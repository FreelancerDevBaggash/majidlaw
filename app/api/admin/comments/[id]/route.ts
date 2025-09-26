import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Comment from "@/models/Comment"

export const dynamic = "force-dynamic"

export async function GET(
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

    const comment = await Comment.findById(id)
      .populate({ 
        path: "postId", 
        select: "title slug excerpt",
        match: { published: true }
      })
      .lean()

    if (!comment) {
      return NextResponse.json(
        { error: "التعليق غير موجود" }, 
        { status: 404 }
      )
    }

    // التحقق من وجود postId بشكل آمن
    const postId = (comment as any).postId
    if (!postId) {
      return NextResponse.json(
        { error: "المقال المرتبط غير موجود" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error("Get comment error:", error)
    return NextResponse.json(
      { error: "خطأ في جلب التعليق" }, 
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const body = await request.json()

    const allowedFields = ['content', 'approved', 'name']
    const updateData: any = {}

    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key]
      }
    })

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate({ path: "postId", select: "title slug" })

    if (!updatedComment) {
      return NextResponse.json(
        { error: "التعليق غير موجود" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      comment: updatedComment,
      message: "تم تحديث التعليق بنجاح"
    })
  } catch (error) {
    console.error("Update comment error:", error)
    return NextResponse.json(
      { error: "خطأ في تحديث التعليق" }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const deletedComment = await Comment.findByIdAndDelete(id)
    
    if (!deletedComment) {
      return NextResponse.json(
        { error: "التعليق غير موجود" }, 
        { status: 404 }
      )
    }

    // حذف جميع الردود المرتبطة بهذا التعليق
    await Comment.deleteMany({ parentId: id })

    return NextResponse.json({ 
      success: true, 
      message: "تم حذف التعليق وجميع الردود المرتبطة به" 
    })
  } catch (error) {
    console.error("Delete comment error:", error)
    return NextResponse.json(
      { error: "خطأ في حذف التعليق" }, 
      { status: 500 }
    )
  }
}