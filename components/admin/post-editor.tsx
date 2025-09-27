"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import {
  Send, ArrowLeft, Edit3, FileText, BookOpen, Settings, Info, Calendar, User, Clock, Type, Link as LinkIcon, Tag, Plus, X, Download, Trash2
} from "lucide-react"
import { adminAuth } from "@/lib/admin-auth" // استدعاء مكتبة الجلسة
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import ImageUploader from "../imageUploader"
import { IBlogPost } from "@/models/BlogPost"

interface BlogCategory {
  slug: string
  name: string
}

const blogCategories: BlogCategory[] = [
  { slug: "legal-advice", name: "نصائح قانونية" },
  { slug: "laws", name: "القوانين والتشريعات" },
  { slug: "court", name: "القضاء والإجراءات" },
  { slug: "rights", name: "الحقوق والواجبات" },
  { slug: "contracts", name: "العقود والاتفاقيات" },
  { slug: "business", name: "قانون عمل" },
  { slug: "arbitration", name: "تحكيم" },
  { slug: "family", name: "قانون الأسرة" },
  { slug: "criminal", name: "القانون الجنائي" },
]

interface BlogPost {
  _id?: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  slug: string
  image: string
  published: boolean
  readTime: number
  tags: string[]
  createdAt?: string
  updatedAt?: string
  __v?: number
}
interface PostEditorProps {
  post?: IBlogPost | null
}


export default function AddPostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [newTag, setNewTag] = useState("")
  const [currentUser, setCurrentUser] = useState<string>("") // المستخدم الحالي

  const [formData, setFormData] = useState<Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt' | '__v'>>({
    title: "",
    excerpt: "",
    content: "",
    author: "فريق المكتب القانوني", // سيتم تغييره بعد جلب المستخدم
    category: "",
    slug: "",
    image: "",
    published: false,
    readTime: 1,
    tags: [],
  })

  // جلب المستخدم الحالي عند التحميل
  useEffect(() => {
    const session = adminAuth.getSession()
    if (session?.username) {
      setCurrentUser(session.username)
      setFormData(prev => ({ ...prev, author: session.username })) // تعيين الكاتب الحالي
    }
  }, [])

  // تحديث عدد الكلمات ووقت القراءة عند تغيير المحتوى
  useEffect(() => {
    const words = formData.content.split(/\s+/).filter(word => word.length > 0).length
    setWordCount(words)

    const readTime = Math.max(1, Math.ceil(words / 200))
    setFormData(prev => ({ ...prev, readTime }))
  }, [formData.content])

  // توليد slug تلقائيًا عند تغيير العنوان
  useEffect(() => {
    if (formData.title.trim()) {
      const slug = generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title])

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!formData.title.trim()) {
      setError("عنوان المقال مطلوب")
      setIsLoading(false)
      return
    }

    if (!formData.excerpt.trim()) {
      setError("مقدمة المقال مطلوبة")
      setIsLoading(false)
      return
    }

    if (!formData.content.trim()) {
      setError("محتوى المقال مطلوب")
      setIsLoading(false)
      return
    }

    if (!formData.category) {
      setError("تصنيف المقال مطلوب")
      setIsLoading(false)
      return
    }

    try {
      const postData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author,
        category: formData.category,
        slug: formData.slug || generateSlug(formData.title),
        image: formData.image.trim() || "/abstract-article-image.png",
        published: formData.published,
        readTime: formData.readTime,
        tags: formData.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log("Submitting post data:", postData)

      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      console.log("API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("API error:", errorData)
        throw new Error(errorData.error || "فشل في حفظ المقال")
      }

      const result = await response.json()
      console.log("API success:", result)

      setSuccess("تم إنشاء المقال بنجاح")

      // Reset form
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        author: "فريق المكتب القانوني",
        category: "",
        slug: "",
        image: "",
        published: false,
        readTime: 1,
        tags: [],
      })

      // Redirect to posts list after 2 seconds
      setTimeout(() => {
        router.push("/admin/posts")
        router.refresh()
      }, 2000)
    } catch (err) {
      console.error("Submit error:", err)
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء حفظ المقال")
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSaveDraft = () => {
    setFormData(prev => ({
      ...prev,
      published: false
    }))
    setSuccess("تم حفظ المقال كمسودة")
  }

  const handleClearForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "فريق المكتب القانوني",
      category: "",
      slug: "",
      image: "",
      published: false,
      readTime: 1,
      tags: [],
    })
    setNewTag("")
    setError("")
    setSuccess("تم مسح النموذج")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Edit3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-arabic text-foreground">إضافة مقال جديد</h1>
              <p className="text-muted-foreground font-arabic mt-1">أضف مقال جديد إلى المدونة القانونية</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/admin/posts">
              <Button variant="ghost" className="font-arabic gap-2">
                <ArrowLeft className="w-4 h-4" />
                العودة للمقالات
              </Button>
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription className="font-arabic flex items-center gap-2">
              <Send className="w-4 h-4" />
              {success}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="font-arabic flex items-center gap-2">
              <X className="w-4 h-4" />
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle className="font-arabic flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    محتوى المقال
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-arabic text-base flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      عنوان المقال *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="ادخل عنوان المقال الجذاب والمفيد"
                      className="font-arabic text-lg h-12"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="font-arabic text-base flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      المقدمة *
                    </Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="اكتب مقدمة مختصرة وجذابة للمقال تشرح الفكرة الرئيسية"
                      rows={4}
                      className="font-arabic text-base"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content" className="font-arabic text-base flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        محتوى المقال *
                      </Label>
                      <span className="text-sm text-muted-foreground font-arabic">
                        {wordCount} كلمة
                      </span>
                    </div>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="اكتب محتوى المقال الكامل هنا... يمكنك استخدام العناوين والفقرات والقوائم لتنظيم المحتوى"
                      rows={20}
                      className="font-arabic text-base leading-relaxed"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="font-arabic text-base flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      الوسوم
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="أضف وسم جديد"
                        className="font-arabic"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        disabled={isLoading || !newTag.trim()}
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
                          <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full text-sm">
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-muted-foreground hover:text-foreground"
                              disabled={isLoading}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle className="font-arabic flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    إعدادات النشر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Publish Switch */}
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <Label htmlFor="published" className="font-arabic text-base block">
                        حالة النشر
                      </Label>
                      <p className="text-sm text-muted-foreground font-arabic">
                        {formData.published ? "المقال سيكون مرئيًا للجميع" : "المقال سيكون مسودة"}
                      </p>
                    </div>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={handleSwitchChange}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-arabic text-base flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      التصنيف *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={handleSelectChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="font-arabic h-12">
                        <SelectValue placeholder="اختر التصنيف المناسب" />
                      </SelectTrigger>
                      <SelectContent>
                        {blogCategories.map((category) => (
                          <SelectItem
                            key={category.slug}
                            value={category.name}
                            className="font-arabic"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Author */}
                  <div className="space-y-2">
                    <Label htmlFor="author" className="font-arabic text-base flex items-center gap-2">
                      <User className="w-4 h-4" />
                      الكاتب
                    </Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="اسم الكاتب"
                      className="font-arabic"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    
                    <ImageUploader
                      label="الصورة الرئيسية"
                      endpoint="blogImage"
                      value={formData.image}
                      onChange={(url) => setFormData((p) => ({ ...p, image: url }))}
                      error={error}
                      setError={setError}
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="font-arabic text-base flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      الرابط (Slug)
                    </Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="رابط المقال التلقائي"
                      className="font-arabic"
                      disabled={isLoading}
                    />
                    <p className="text-sm text-muted-foreground font-arabic">
                      يتم توليد الرابط تلقائيًا من العنوان
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Post Information */}
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle className="font-arabic flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    معلومات المقال
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="text-sm text-muted-foreground font-arabic space-y-3">
                    <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                      <span className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        الكاتب:
                      </span>
                      <strong>{formData.author}</strong>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        تاريخ الإنشاء:
                      </span>
                      <strong>{new Date().toLocaleDateString("ar-SA")}</strong>
                    </div>

                    <div className="p-2 rounded bg-muted/30">
                      <div className="flex justify-between items-start mb-1">
                        <span className="flex items-center gap-2">
                          <LinkIcon className="w-3 h-3" />
                          الرابط:
                        </span>
                      </div>
                      <code className="text-xs break-all bg-background p-1 rounded mt-1 block">
                        /blog/{formData.slug || generateSlug(formData.title)}
                      </code>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                      <span className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        وقت القراءة:
                      </span>
                      <strong>{formData.readTime} دقيقة</strong>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                      <span className="flex items-center gap-2">
                        <Type className="w-3 h-3" />
                        عدد الكلمات:
                      </span>
                      <strong>{wordCount}</strong>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="p-2 rounded bg-muted/30">
                        <div className="flex justify-between items-start mb-1">
                          <span className="flex items-center gap-2">
                            <Tag className="w-3 h-3" />
                            الوسوم:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-background px-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full font-arabic h-12 text-lg gap-2"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      جاري حفظ المقال...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {formData.published ? "نشر المقال" : "حفظ كمسودة"}
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="font-arabic gap-2"
                    onClick={handleSaveDraft}
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4" />
                    حفظ مسودة
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="font-arabic gap-2"
                    onClick={handleClearForm}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                    مسح الكل
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full font-arabic gap-2"
                  onClick={() => router.push("/admin/posts")}
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4" />
                  إلغاء والعودة
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}