// app/api/blog/categories/route.ts
import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // جلب التصنيفات مع عدد المقالات المنشورة في كل تصنيف
    const categories = await BlogPost.aggregate([
      { 
        $match: { 
          published: true 
        } 
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json(
      { error: "خطأ في جلب التصنيفات" }, 
      { status: 500 }
    )
  }
}