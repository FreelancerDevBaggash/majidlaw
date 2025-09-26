"use client"

import { useState, useEffect } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, User, Plus, Trash2 } from "lucide-react"
import { adminAuth } from "@/lib/admin-auth"

interface UserType {
  id: string
  username: string
  email: string
  role: "admin" | "editor"
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"admin" | "editor">("editor")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [currentRole, setCurrentRole] = useState<string | null>(null)

  useEffect(() => {
    const session = adminAuth.getSession()
    setCurrentRole(session?.role || null)
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/auth/login/us")
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAddUser = async () => {
    try {
      const res = await fetch("/api/admin/auth/login/us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "خطأ في الإضافة")
      setUsers(prev => [data.user, ...prev])
      setUsername(""); setEmail(""); setPassword(""); setRole("editor")
      setSuccess("تم إضافة المستخدم بنجاح")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(""), 5000)
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/auth/login/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "خطأ في الحذف")
      setUsers(users.filter(u => u.id !== id))
      setSuccess("تم حذف المستخدم")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(""), 5000)
    }
  }

  return (
    <AdminGuard requiredRole="admin">
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex flex-col lg:flex-row">
          <AdminSidebar />
          <main className="flex-1 lg:mr-64 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold font-arabic">إدارة المستخدمين</h1>
                <p className="text-muted-foreground mt-2 font-arabic">عرض وإضافة وحذف المستخدمين</p>
              </div>

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription className="font-arabic flex items-center gap-2">
                    <User className="w-4 h-4" />{success}
                  </AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="font-arabic flex items-center gap-2">
                    <X className="w-4 h-4" />{error}
                  </AlertDescription>
                </Alert>
              )}

              {currentRole === "admin" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-arabic flex items-center gap-2">
                      <Plus className="w-5 h-5" />إضافة مستخدم جديد
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-arabic">اسم المستخدم</Label>
                        <Input value={username} onChange={e => setUsername(e.target.value)} className="font-arabic" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-arabic">البريد الإلكتروني</Label>
                        <Input value={email} onChange={e => setEmail(e.target.value)} className="font-arabic" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-arabic">كلمة المرور</Label>
                        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="font-arabic" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-arabic">الصلاحية</Label>
                        <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full font-arabic border rounded px-2 py-1">
                          <option value="admin">مدير</option>
                          <option value="editor">محرر</option>
                        </select>
                      </div>
                    </div>
                    <Button onClick={handleAddUser} className="font-arabic w-full md:w-auto">
                      إضافة المستخدم
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">المستخدمون الحاليون</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left font-arabic border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="p-2 border">الاسم</th>
                          <th className="p-2 border">البريد الإلكتروني</th>
                          <th className="p-2 border">الصلاحية</th>
                          <th className="p-2 border">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id} className="border-b">
                            <td className="p-2 border">{user.username}</td>
                            <td className="p-2 border">{user.email}</td>
                            <td className="p-2 border">{user.role}</td>
                            <td className="p-2 border flex gap-2">
                              {currentRole === "admin" && (
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center p-4 font-arabic text-muted-foreground">
                              لا يوجد مستخدمون حالياً
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
  