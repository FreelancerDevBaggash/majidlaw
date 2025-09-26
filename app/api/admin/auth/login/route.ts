// /app/api/admin/users/route.ts
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 })
    return NextResponse.json(users)
  } catch (error) {
    console.error("Fetch users error:", error)
    return NextResponse.json({ error: "خطأ في جلب المستخدمين" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { identifier, password } = await request.json() // identifier يمكن أن يكون username أو email

    if (!identifier || !password) {
      return NextResponse.json({ error: "اسم المستخدم/البريد الإلكتروني وكلمة المرور مطلوبة" }, { status: 400 })
    }

    // البحث عن المستخدم باستخدام username أو email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    })

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 })
    }

    // العودة ببيانات المستخدم بدون كلمة المرور
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }

    return NextResponse.json({ success: true, user: userData })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "خطأ في تسجيل الدخول" }, { status: 500 })
  }
}
