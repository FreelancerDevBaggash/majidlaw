// app/api/admin/team/route.ts
import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import TeamMember from "@/models/TeamMember"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const specialization = searchParams.get("specialization") || ""

    const skip = (page - 1) * limit

    const query: any = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } }
      ]
    }

    if (specialization) {
      query.specialization = { $in: [specialization] }
    }

    const teamMembers = await TeamMember.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await TeamMember.countDocuments(query)

    return NextResponse.json({
      teamMembers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في جلب أعضاء الفريق" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const memberData = await request.json()

    const requiredFields = ['name', 'position', 'bio']
    for (const field of requiredFields) {
      if (!memberData[field]) {
        return NextResponse.json(
          { error: `حقل ${field} مطلوب` },
          { status: 400 }
        )
      }
    }

    const newMember = new TeamMember(memberData)
    await newMember.save()

    return NextResponse.json(
      { success: true, teamMember: newMember },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في إنشاء عضو الفريق" },
      { status: 500 }
    )
  }
}