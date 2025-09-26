import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "معرف المقال غير صحيح" }, { status: 400 })
    }

    const post = await BlogPost.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Get post error:", error)
    return NextResponse.json({ error: "خطأ في جلب المقال" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "معرف المقال غير صحيح" }, { status: 400 })
    }

    const updateData = await request.json()

    const post = await BlogPost.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true })

    if (!post) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error("Update post error:", error)
    return NextResponse.json({ error: "خطأ في تحديث المقال" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "معرف المقال غير صحيح" }, { status: 400 })
    }

    const post = await BlogPost.findByIdAndDelete(params.id)

    if (!post) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف المقال بنجاح",
    })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "خطأ في حذف المقال" }, { status: 500 })
  }
}
