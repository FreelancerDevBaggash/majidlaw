// // /app/api/admin/users/[id]/route.ts
// import connectDB from "@/lib/mongodb"
// import User from "@/models/User"
// import { NextRequest, NextResponse } from "next/server"

// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     await connectDB()
//     const { id } = params
//     const deletedUser = await User.findByIdAndDelete(id)

//     if (!deletedUser) {
//       return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
//     }

//     return NextResponse.json({ success: true, message: "تم حذف المستخدم" })
//   } catch (error) {
//     console.error("Delete user error:", error)
//     return NextResponse.json({ error: "خطأ في حذف المستخدم" }, { status: 500 })
//   }
// }
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/admin-auth" // إضافة

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // التحقق من الدور
    const session = adminAuth.getSession(request)
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    }

    const { id } = params
    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "تم حذف المستخدم" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "خطأ في حذف المستخدم" }, { status: 500 })
  }
}
