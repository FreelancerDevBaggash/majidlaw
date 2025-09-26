import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Use request.nextUrl instead of new URL(request.url)
    const { searchParams } = request.nextUrl
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""

    const skip = (page - 1) * limit

    // Build query - فقط المقالات المنشورة
    const query: any = { published: true }

    if (search) {
      query.$text = { $search: search }
    }

    if (category) {
      query.category = category
    }

    // Get posts with pagination
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content') // لا نعيد المحتوى الكامل في القائمة
      .lean()

    // Get total count
    const total = await BlogPost.countDocuments(query)

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get blog posts error:", error)
    return NextResponse.json({ error: "خطأ في جلب المقالات" }, { status: 500 })
  }
}
