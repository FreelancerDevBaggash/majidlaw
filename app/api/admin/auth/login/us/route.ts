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
    const { username, email, password, role } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return NextResponse.json({ error: "اسم المستخدم أو البريد الإلكتروني موجود مسبقاً" }, { status: 400 })
    }

    const user = new User({ username, email, password, role })
    await user.save()

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }

    return NextResponse.json({ success: true, user: userData })
  } catch (error) {
    console.error("Add user error:", error)
    return NextResponse.json({ error: "خطأ في إضافة المستخدم" }, { status: 500 })
  }
}
