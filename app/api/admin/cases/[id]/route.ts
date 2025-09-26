// app/api/admin/cases/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Case from "@/models/Case"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const caseItem = await Case.findById(params.id)
    if (!caseItem) {
      return NextResponse.json(
        { error: "القضية غير موجودة" },
        { status: 404 }
      )
    }

    return NextResponse.json({ case: caseItem })
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في جلب القضية" },
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

    const caseData = await request.json()
    const updatedCase = await Case.findByIdAndUpdate(
      params.id,
      caseData,
      { new: true }
    )

    if (!updatedCase) {
      return NextResponse.json(
        { error: "القضية غير موجودة" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, case: updatedCase })
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في تحديث القضية" },
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

    const deletedCase = await Case.findByIdAndDelete(params.id)
    if (!deletedCase) {
      return NextResponse.json(
        { error: "القضية غير موجودة" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: "تم حذف القضية بنجاح" })
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في حذف القضية" },
      { status: 500 }
    )
  }
}