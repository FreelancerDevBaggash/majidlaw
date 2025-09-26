// components/admin/case-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  ArrowLeft, 
  Save, 
  Building,
  Users,
  Gavel,
  Trophy,
  Home,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"

const caseTypes = [
  { value: "تجاري", label: "تجاري", icon: Building },
  { value: "مدني", label: "مدني", icon: Users },
  { value: "تحكيم", label: "تحكيم", icon: Gavel },
  { value: "جنائي", label: "جنائي", icon: Trophy },
  { value: "أسرة", label: "أسرة", icon: Home },
  { value: "عمل", label: "عمل", icon: Briefcase }
]

const statusTypes = [
  { value: "مكتملة", label: "مكتملة", icon: CheckCircle },
  { value: "جارية", label: "جارية", icon: Clock },
  { value: "ملغاة", label: "ملغاة", icon: XCircle }
]

export function CaseForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const caseId = searchParams.get('id')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: new Date().getFullYear().toString(),
    type: "تجاري",
    result: "",
    status: "مكتملة",
    client: "",
    value: "",
    duration: "",
    tags: [] as string[],
    featured: false,
    image: ""
  })

  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (caseId) {
      fetchCaseData()
    }
  }, [caseId])

  const fetchCaseData = async () => {
    try {
      const res = await fetch(`/api/admin/cases/${caseId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData(data.case)
      }
    } catch (err) {
      console.error("Error fetching case:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const url = caseId ? `/api/admin/cases/${caseId}` : "/api/admin/cases"
      const method = caseId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "حدث خطأ أثناء الحفظ")
      }

      setSuccess(caseId ? "تم تحديث القضية بنجاح" : "تم إنشاء القضية بنجاح")
      
      setTimeout(() => {
        router.push("/admin/cases")
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-arabic">
            {caseId ? "تعديل القضية" : "إضافة قضية جديدة"}
          </h1>
          <p className="text-muted-foreground font-arabic mt-1">
            {caseId ? "تعديل بيانات القضية" : "أضف قضية جديدة إلى سجل النجاحات"}
          </p>
        </div>
        <Link href="/admin/cases">
          <Button variant="outline" className="font-arabic">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للقضايا
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription className="font-arabic">{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="font-arabic">{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">معلومات القضية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-arabic">عنوان القضية *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="أدخل عنوان القضية"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-arabic">وصف القضية *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف مفصل للقضية والإجراءات المتخذة"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="result" className="font-arabic">النتيجة *</Label>
                  <Textarea
                    id="result"
                    value={formData.result}
                    onChange={(e) => setFormData(prev => ({ ...prev, result: e.target.value }))}
                    placeholder="النتيجة النهائية للقضية"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="year" className="font-arabic">سنة القضية *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2024"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="font-arabic">نوع القضية *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {caseTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="font-arabic">حالة القضية *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusTypes.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <status.icon className="w-4 h-4" />
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                                <div className="space-y-2">
                  <Label htmlFor="client" className="font-arabic">اسم العميل *</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                    placeholder="اسم العميل أو الشركة"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value" className="font-arabic">قيمة القضية</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="مثال: 50 مليون ريال"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="font-arabic">مدة القضية</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="مثال: 6 أشهر"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured" className="font-arabic">قضية مميزة</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">الكلمات المفتاحية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags" className="font-arabic">إضافة كلمات مفتاحية</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="أدخل كلمة مفتاحية"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      إضافة
                    </Button>
                  </div>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="font-arabic">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="mr-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">صورة القضية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="image" className="font-arabic">رابط الصورة</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Link href="/admin/cases">
            <Button type="button" variant="outline" className="font-arabic">
              إلغاء
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="font-arabic">
            <Save className="w-4 h-4 ml-2" />
            {loading ? "جاري الحفظ..." : (caseId ? "تحديث القضية" : "إنشاء القضية")}
          </Button>
        </div>
      </form>
    </div>
  )
}