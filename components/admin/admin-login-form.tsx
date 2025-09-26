"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icons } from "@/components/icons"
import { adminAuth } from "@/lib/admin-auth"

export function AdminLoginForm() {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  try {
    const success = await adminAuth.login(formData.username, formData.password)

    if (!success) {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة")
    } else {
      router.push("/admin") // ✅ الآن الجلسة موجودة، والحارس يمرر الدخول
    }
  } catch (err: any) {
    setError(err?.message || "حدث خطأ أثناء تسجيل الدخول")
  } finally {
    setIsLoading(false)
  }
}

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 bg-card rounded-lg shadow-md">
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="font-arabic">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="username" className="font-arabic">اسم المستخدم</Label>
        <Input
          id="username"
          type="text"
          placeholder="ادخل اسم المستخدم"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="font-arabic"
          required
        />
      </div>

      <div className="space-y-2 relative">
        <Label htmlFor="password" className="font-arabic">كلمة المرور</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="ادخل كلمة المرور"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="font-arabic pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        >
          {showPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
        </button>
      </div>

      <Button type="submit" className="w-full font-arabic" disabled={isLoading}>
        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </Button>
    </form>
  )
}
