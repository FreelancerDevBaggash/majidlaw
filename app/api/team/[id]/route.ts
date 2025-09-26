// app/api/admin/team/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import TeamMember from "@/models/TeamMember"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const member = await TeamMember.findById(params.id)
    if (!member) {
      return NextResponse.json(
        { error: "عضو الفريق غير موجود" },
        { status: 404 }
      )
    }

    return NextResponse.json({ teamMember: member })
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في جلب عضو الفريق" },
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

    const memberData = await request.json()
    const updatedMember = await TeamMember.findByIdAndUpdate(
      params.id,
      memberData,
      { new: true }
    )

    if (!updatedMember) {
      return NextResponse.json(
        { error: "عضو الفريق غير موجود" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, teamMember: updatedMember })
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في تحديث عضو الفريق" },
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

    const deletedMember = await TeamMember.findByIdAndDelete(params.id)
    if (!deletedMember) {
      return NextResponse.json(
        { error: "عضو الفريق غير موجود" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: "تم حذف عضو الفريق بنجاح" })
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في حذف عضو الفريق" },
      { status: 500 }
    )
  }
}