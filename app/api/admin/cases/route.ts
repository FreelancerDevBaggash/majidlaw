// app/api/admin/cases/route.ts
import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Case from "@/models/Case"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || ""
    const status = searchParams.get("status") || ""

    const skip = (page - 1) * limit

    // بناء query التصفية
    const query: any = {}
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { client: { $regex: search, $options: "i" } }
      ]
    }

    if (type) query.type = type
    if (status) query.status = status

    // جلب القضايا مع التصفية
    const cases = await Case.find(query)
      .sort({ year: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // العدد الإجمالي
    const total = await Case.countDocuments(query)

    return NextResponse.json({
      cases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في جلب القضايا" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const caseData = await request.json()

    // التحقق من البيانات المطلوبة
    const requiredFields = ['title', 'description', 'year', 'type', 'result', 'client']
    for (const field of requiredFields) {
      if (!caseData[field]) {
        return NextResponse.json(
          { error: `حقل ${field} مطلوب` },
          { status: 400 }
        )
      }
    }

    const newCase = new Case(caseData)
    await newCase.save()

    return NextResponse.json(
      { success: true, case: newCase },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في إنشاء القضية" },
      { status: 500 }
    )
  }
}