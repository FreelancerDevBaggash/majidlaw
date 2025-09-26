"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Mail,
  Phone,
} from "lucide-react"
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

const defaultSpecializations = [
  "التجاري",
  "المدني",
  "الجنائي",
  "الأسرة",
  "العمل",
  "التحكيم",
  "الملكية الفكرية",
  "الضرائب",
  "التأمين"
]

const defaultLanguages = [
  "العربية",
  "الإنجليزية",
  "الفرنسية",
  "الألمانية",
  "الإسبانية",
  "الصينية"
]

interface TeamMemberFormData {
  name: string
  position: string
  bio: string
  image: string
  email: string
  phone: string
  specialization: string[]
  experience: string
  education: string[]
  languages: string[]
  order: number
  featured: boolean
  active: boolean
}

export function TeamMemberForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const memberId = searchParams.get('id')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: "",
    position: "",
    bio: "",
    image: "",
    email: "",
    phone: "",
    specialization: [],
    experience: "",
    education: [],
    languages: [],
    order: 0,
    featured: false,
    active: true
  })

  const [newSpecialization, setNewSpecialization] = useState("")
  const [newEducation, setNewEducation] = useState("")
  const [newLanguage, setNewLanguage] = useState("")

  useEffect(() => {
    if (memberId) {
      fetchMemberData()
    }
  }, [memberId])

  const fetchMemberData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/team/${memberId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData(data.teamMember)
      } else {
        setError("فشل في تحميل بيانات العضو")
      }
    } catch (err) {
      console.error("Error fetching team member:", err)
      setError("حدث خطأ أثناء تحميل البيانات")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // التحقق من الحقول المطلوبة
      if (!formData.name.trim() || !formData.position.trim() || !formData.bio.trim()) {
        throw new Error("الاسم والمنصب والسيرة الذاتية حقول مطلوبة")
      }

      const url = memberId ? `/api/team/${memberId}` : "/api/team"
      const method = memberId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "حدث خطأ أثناء الحفظ")
      }

      setSuccess(memberId ? "تم تحديث العضو بنجاح" : "تم إنشاء العضو بنجاح")

      setTimeout(() => {
        router.push("/admin/team")
        router.refresh() // تحديث البيانات في الصفحة
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addSpecialization = () => {
    const spec = newSpecialization.trim()
    if (spec && !formData.specialization.includes(spec)) {
      setFormData(prev => ({
        ...prev,
        specialization: [...prev.specialization, spec]
      }))
      setNewSpecialization("")
    }
  }

  const removeSpecialization = (specToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.filter(spec => spec !== specToRemove)
    }))
  }

  const addEducation = () => {
    const edu = newEducation.trim()
    if (edu && !formData.education.includes(edu)) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, edu]
      }))
      setNewEducation("")
    }
  }

  const removeEducation = (eduToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu !== eduToRemove)
    }))
  }

  const addLanguage = () => {
    const lang = newLanguage.trim()
    if (lang && !formData.languages.includes(lang)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, lang]
      }))
      setNewLanguage("")
    }
  }

  const removeLanguage = (langToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== langToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent, type: 'spec' | 'edu' | 'lang') => {
    if (e.key === 'Enter') {
      e.preventDefault()
      switch (type) {
        case 'spec': addSpecialization(); break
        case 'edu': addEducation(); break
        case 'lang': addLanguage(); break
      }
    }
  }

  if (loading && memberId) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 font-arabic">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-arabic">
            {memberId ? "تعديل العضو" : "إضافة عضو جديد"}
          </h1>
          <p className="text-muted-foreground font-arabic mt-1">
            {memberId ? "تعديل بيانات العضو" : "أضف عضو جديد إلى فريق العمل"}
          </p>
        </div>
        <Link href="/admin/team">
          <Button variant="outline" className="font-arabic gap-2">
            <ArrowLeft className="w-4 h-4" />
            العودة للأعضاء
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* المعلومات الأساسية */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic flex items-center gap-2">
                  <span>المعلومات الأساسية</span>
                </CardTitle>
                <CardDescription className="font-arabic">
                  المعلومات الأساسية للعضو التي ستظهر في الملف الشخصي
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-arabic">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="أدخل الاسم الكامل"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="font-arabic">المنصب *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="مثال: محامي أول، مستشار قانوني"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="font-arabic">السيرة الذاتية *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="وصف مفصل عن الخبرات والإنجازات"
                    rows={6}
                    required
                    disabled={loading}
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="font-arabic">سنوات الخبرة</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="مثال: 10 سنوات"
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* المؤهلات والتخصصات */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">المؤهلات والتخصصات</CardTitle>
                <CardDescription className="font-arabic">
                  التخصصات القانونية والمؤهلات العلمية واللغات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* التخصصات */}
                <div className="space-y-3">
                  <Label className="font-arabic text-base">مجالات التخصص</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, 'spec')}
                      placeholder="أدخل تخصص جديد"
                      className="flex-1"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={addSpecialization}
                      variant="outline"
                      disabled={loading || !newSpecialization.trim()}
                    >
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.specialization.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="font-arabic px-3 py-1">
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeSpecialization(spec)}
                          className="mr-1 hover:text-destructive text-sm"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* المؤهلات العلمية */}
                <div className="space-y-3">
                  <Label className="font-arabic text-base">المؤهلات العلمية</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newEducation}
                      onChange={(e) => setNewEducation(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, 'edu')}
                      placeholder="أدخل مؤهل علمي"
                      className="flex-1"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={addEducation}
                      variant="outline"
                      disabled={loading || !newEducation.trim()}
                    >
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.education.map((edu, index) => (
                      <Badge key={index} variant="outline" className="font-arabic px-3 py-1">
                        {edu}
                        <button
                          type="button"
                          onClick={() => removeEducation(edu)}
                          className="mr-1 hover:text-destructive text-sm"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* اللغات */}
                <div className="space-y-3">
                  <Label className="font-arabic text-base">اللغات المتقنة</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, 'lang')}
                      placeholder="أدخل لغة"
                      className="flex-1"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={addLanguage}
                      variant="outline"
                      disabled={loading || !newLanguage.trim()}
                    >
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="font-arabic px-3 py-1">
                        {lang}
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang)}
                          className="mr-1 hover:text-destructive text-sm"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* الإعدادات */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order" className="font-arabic">ترتيب الظهور</Label>
                  <Input
                    id="order"
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    disabled={loading}
                  />
                  <p className="text-sm text-muted-foreground font-arabic">
                    الرقم الأصغر يظهر أولاً
                  </p>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="featured" className="font-arabic cursor-pointer">عضو مميز</Label>
                    <p className="text-sm text-muted-foreground font-arabic">سيظهر في القسم المميز</p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="active" className="font-arabic cursor-pointer">نشط</Label>
                    <p className="text-sm text-muted-foreground font-arabic">إظهار العضو في الموقع</p>
                  </div>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* معلومات الاتصال */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">معلومات الاتصال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-arabic">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                      disabled={loading}
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-arabic">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+966 5X XXX XXXX"
                      disabled={loading}
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-arabic">صورة العضو</Label>
                  <UploadButton<OurFileRouter, "imageUploader">
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0].url) {
                        setFormData((prev) => ({ ...prev, image: res[0].url }))
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setError("فشل في رفع الصورة: " + error.message)
                    }}
                  />
                  {formData.image && (
                    <div className="mt-4">
                      <img
                        src={formData.image}
                        alt="صورة العضو"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                      <p className="text-sm text-muted-foreground mt-1 font-arabic">تم رفع الصورة بنجاح</p>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* زر الحفظ */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2"
              size="lg"
            >
              <Save className="w-4 h-4" />
              {loading ? "جاري الحفظ..." : (memberId ? "تحديث العضو" : "إضافة العضو")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}