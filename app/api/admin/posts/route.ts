import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const published = searchParams.get("published")

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    if (search) {
      query.$text = { $search: search }
    }

    if (category) {
      query.category = category
    }

    if (published !== null && published !== "") {
      query.published = published === "true"
    }

    // Get posts with pagination
    const posts = await BlogPost.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

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
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "خطأ في جلب المقالات" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const postData = await request.json()

    // Create new post
    const post = new BlogPost(postData)
    await post.save()

    return NextResponse.json(
      {
        success: true,
        post,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "خطأ في إنشاء المقال" }, { status: 500 })
  }
}
