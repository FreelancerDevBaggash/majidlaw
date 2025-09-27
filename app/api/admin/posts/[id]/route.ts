// app/api/admin/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import mongoose from "mongoose";

const allowedUpdateFields = [
  "title",
  "excerpt",
  "content",
  "author",
  "category",
  "slug",
  "image",
  "published",
  "readTime",
  "tags",
];

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "معرف المقال غير صحيح" }, { status: 400 });
    }

    const post = await BlogPost.findById(params.id).lean();
    if (!post) return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });

    return NextResponse.json({ post, relatedPosts: [] });
  } catch (error) {
    console.error("Get post error:", error);
    return NextResponse.json({ error: "خطأ في جلب المقال" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "معرف المقال غير صحيح" }, { status: 400 });
    }

    const body = await req.json();
    const updateData: any = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedUpdateFields.includes(key))
    );

    const post = await BlogPost.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!post) return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: "خطأ في تحديث المقال" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "معرف المقال غير صحيح" }, { status: 400 });
    }

    const post = await BlogPost.findByIdAndDelete(params.id).lean();
    if (!post) return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });

    return NextResponse.json({ success: true, message: "تم حذف المقال بنجاح" });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: "خطأ في حذف المقال" }, { status: 500 });
  }
}
