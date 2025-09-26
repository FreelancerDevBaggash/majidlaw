"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { 
  MoreHorizontal, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  Filter, 
  Download, 
  Star, 
  EyeOff,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Shield
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  slug: string
  category: string
  published: boolean
  createdAt: string
  updatedAt: string
  views?: number
  featured?: boolean
  author?: string
  readTime?: number
  image?: string
}

export function PostsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [bulkActions, setBulkActions] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | "views">("newest")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // جلب المقالات من API
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/posts")
      if (!res.ok) throw new Error("فشل في جلب البيانات")
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (err) {
      console.error("Error fetching posts:", err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchPosts()
  }

  // الحصول على التصنيفات الفريدة
  const categories = [...new Set(posts.map(post => post.category))]

  // تصفية وتصنيف المقالات
  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "published" && post.published) ||
                           (statusFilter === "draft" && !post.published)

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "views":
          return (b.views || 0) - (a.views || 0)
        default:
          return 0
      }
    })

  // وظائف CRUD
  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, { 
        method: "DELETE" 
      })
      if (!res.ok) throw new Error("فشل في حذف المقال")
      setPosts(posts.filter((post) => post._id !== postId))
      setDeleteDialogOpen(false)
      setSelectedPost(null)
    } catch (err) {
      console.error("Error deleting post:", err)
    }
  }

  const togglePublishStatus = async (postId: string) => {
    try {
      const post = posts.find((p) => p._id === postId)
      if (!post) return

      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      })
      
      if (!res.ok) throw new Error("فشل في تحديث حالة النشر")
      
      setPosts(posts.map((p) => 
        p._id === postId ? { ...p, published: !p.published } : p
      ))
    } catch (err) {
      console.error("Error updating publish status:", err)
    }
  }

  const toggleFeaturedStatus = async (postId: string) => {
    try {
      const post = posts.find((p) => p._id === postId)
      if (!post) return

      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !post.featured }),
      })
      
      if (!res.ok) throw new Error("فشل في تحديث حالة التميز")
      
      setPosts(posts.map((p) => 
        p._id === postId ? { ...p, featured: !p.featured } : p
      ))
    } catch (err) {
      console.error("Error updating featured status:", err)
    }
  }

  // الإجراءات الجماعية
  const handleBulkAction = async (action: string) => {
    if (bulkActions.length === 0) return

    try {
      if (action === "delete") {
        if (!confirm(`هل أنت متأكد من حذف ${bulkActions.length} مقال؟`)) return
        
        await Promise.all(
          bulkActions.map(id => 
            fetch(`/api/admin/posts/${id}`, { method: "DELETE" })
          )
        )
        setPosts(posts.filter(post => !bulkActions.includes(post._id)))
        setBulkActions([])
      } else if (action === "publish") {
        await Promise.all(
          bulkActions.map(id => 
            fetch(`/api/admin/posts/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ published: true }),
            })
          )
        )
        setPosts(posts.map(post => 
          bulkActions.includes(post._id) ? { ...post, published: true } : post
        ))
        setBulkActions([])
      } else if (action === "unpublish") {
        await Promise.all(
          bulkActions.map(id => 
            fetch(`/api/admin/posts/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ published: false }),
            })
          )
        )
        setPosts(posts.map(post => 
          bulkActions.includes(post._id) ? { ...post, published: false } : post
        ))
        setBulkActions([])
      } else if (action === "feature") {
        await Promise.all(
          bulkActions.map(id => 
            fetch(`/api/admin/posts/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ featured: true }),
            })
          )
        )
        setPosts(posts.map(post => 
          bulkActions.includes(post._id) ? { ...post, featured: true } : post
        ))
        setBulkActions([])
      } else if (action === "unfeature") {
        await Promise.all(
          bulkActions.map(id => 
            fetch(`/api/admin/posts/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ featured: false }),
            })
          )
        )
        setPosts(posts.map(post => 
          bulkActions.includes(post._id) ? { ...post, featured: false } : post
        ))
        setBulkActions([])
      }
    } catch (err) {
      console.error("Error performing bulk action:", err)
    }
  }

  // تصدير البيانات
  const exportData = () => {
    const dataToExport = filteredPosts.map(post => ({
      العنوان: post.title,
      التصنيف: post.category,
      الحالة: post.published ? "منشور" : "مسودة",
      "تاريخ الإنشاء": new Date(post.createdAt).toLocaleDateString("ar-SA"),
      المشاهدات: post.views || 0,
      الكاتب: post.author || "غير محدد",
      "وقت القراءة": post.readTime || 0,
    }))

    const csv = [
      Object.keys(dataToExport[0]).join(","),
      ...dataToExport.map(row => Object.values(row).join(","))
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `مقالات-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-arabic">إدارة المقالات</h1>
          <p className="text-muted-foreground font-arabic mt-1">إدارة جميع مقالات المدونة والتحكم فيها</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <Button variant="outline" onClick={handleRefresh} className="font-arabic" disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button variant="outline" onClick={exportData} className="font-arabic">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
          <Link href="/admin/posts/new">
            <Button className="font-arabic">
              <Plus className="w-4 h-4 ml-2" />
              مقال جديد
            </Button>
          </Link>
        </div>
      </div>

      {/* الإجراءات الجماعية */}
      {bulkActions.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="font-arabic text-blue-800">
                <CheckCircle2 className="w-4 h-4 inline ml-2" />
                تم تحديد {bulkActions.length} مقال
              </div>
              <div className="flex flex-wrap gap-2">
                <Select onValueChange={handleBulkAction}>
                  <SelectTrigger className="w-40 font-arabic bg-white">
                    <SelectValue placeholder="إجراء جماعي" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publish">نشر المحدد</SelectItem>
                    <SelectItem value="unpublish">إلغاء نشر المحدد</SelectItem>
                    <SelectItem value="feature">تمييز المحدد</SelectItem>
                    <SelectItem value="unfeature">إلغاء تمييز المحدد</SelectItem>
                    <SelectItem value="delete">حذف المحدد</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setBulkActions([])}
                  className="font-arabic"
                >
                  <XCircle className="w-4 h-4 ml-2" />
                  إلغاء التحديد
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium font-arabic text-muted-foreground">إجمالي المقالات</p>
                <p className="text-2xl font-bold">{posts.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium font-arabic text-muted-foreground">منشور</p>
                <p className="text-2xl font-bold">{posts.filter(p => p.published).length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium font-arabic text-muted-foreground">مسودة</p>
                <p className="text-2xl font-bold">{posts.filter(p => !p.published).length}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium font-arabic text-muted-foreground">مميز</p>
                <p className="text-2xl font-bold">{posts.filter(p => p.featured).length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث في العناوين، المحتوى، التصنيفات أو الكاتب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 font-arabic"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="font-arabic">
                <SelectValue placeholder="جميع التصنيفات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="font-arabic">
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="published">منشور</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="font-arabic flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="oldest">الأقدم</SelectItem>
                  <SelectItem value="title">العنوان</SelectItem>
                  <SelectItem value="views">المشاهدات</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                title={viewMode === "table" ? "عرض الشبكة" : "عرض الجدول"}
              >
                {viewMode === "table" ? <BarChart3 className="w-4 h-4" /> : <Table className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table/Grid */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-arabic">المقالات ({filteredPosts.length})</CardTitle>
              <CardDescription className="font-arabic">
                {viewMode === "table" ? "عرض جدول المقالات" : "عرض شبكة المقالات"}
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground font-arabic">
              عرض {filteredPosts.length} من {posts.length} مقال
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center font-arabic">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">جارٍ تحميل المقالات...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 font-arabic text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg">لا توجد مقالات</p>
              <p className="text-sm mt-2">
                {searchQuery || selectedCategory !== "all" || statusFilter !== "all" 
                  ? "جرب تعديل عوامل التصفية للعثور على ما تبحث عنه"
                  : "ابدأ بإنشاء مقالك الأول"
                }
              </p>
              {!searchQuery && selectedCategory === "all" && statusFilter === "all" && (
                <Link href="/admin/posts/new">
                  <Button className="mt-4 font-arabic">
                    <Plus className="w-4 h-4 ml-2" />
                    إنشاء مقال جديد
                  </Button>
                </Link>
              )}
            </div>
          ) : viewMode === "table" ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={bulkActions.length === filteredPosts.length && filteredPosts.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBulkActions(filteredPosts.map(p => p._id))
                          } else {
                            setBulkActions([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead className="font-arabic min-w-[300px]">المقال</TableHead>
                    <TableHead className="font-arabic hidden sm:table-cell">التصنيف</TableHead>
                    <TableHead className="font-arabic hidden md:table-cell">التاريخ</TableHead>
                    <TableHead className="font-arabic">الحالة</TableHead>
                    <TableHead className="font-arabic text-center min-w-[200px]">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post._id} className={bulkActions.includes(post._id) ? "bg-muted/50" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={bulkActions.includes(post._id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBulkActions([...bulkActions, post._id])
                            } else {
                              setBulkActions(bulkActions.filter(id => id !== post._id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          {post.image && (
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-12 h-12 rounded object-cover hidden sm:block"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {post.featured && (
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              )}
                              <div className="font-medium font-arabic line-clamp-2">{post.title}</div>
                            </div>
                            <div className="text-sm text-muted-foreground font-arabic line-clamp-2">
                              {post.excerpt}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>/{post.slug}</span>
                              {post.views !== undefined && (
                                <span>• {post.views} مشاهدة</span>
                              )}
                              {post.readTime && (
                                <span>• {post.readTime} دقيقة</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className="font-arabic">
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col">
                          <span className="text-sm font-arabic">{formatDate(post.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge 
                            variant={post.published ? "default" : "secondary"} 
                            className="font-arabic w-fit text-xs"
                          >
                            {post.published ? "منشور" : "مسودة"}
                          </Badge>
                          <Switch
                            checked={post.published}
                            onCheckedChange={() => togglePublishStatus(post._id)}
                            className="scale-75"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-center gap-1">
                          {/* Preview Button */}
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                              <Eye className="w-3 h-3 ml-1" />
                              معاينة
                            </Button>
                          </Link>
                          
                          {/* Edit Button */}
                          <Link href={`/admin/posts/edit?id=${post._id}`}>
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                              <Edit className="w-3 h-3 ml-1" />
                              تعديل
                            </Button>
                          </Link>
                          
                          {/* Publish/Unpublish Button */}
                          <Button
                            variant={post.published ? "outline" : "default"}
                            size="sm"
                            onClick={() => togglePublishStatus(post._id)}
                            className="h-8 px-2 text-xs"
                          >
                            {post.published ? (
                              <>
                                <EyeOff className="w-3 h-3 ml-1" />
                                إخفاء
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3 ml-1" />
                                نشر
                              </>
                            )}
                          </Button>
                          
                          {/* Feature/Unfeature Button */}
                          <Button
                            variant={post.featured ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleFeaturedStatus(post._id)}
                            className="h-8 px-2 text-xs"
                          >
                            <Star className={`w-3 h-3 ml-1 ${post.featured ? 'fill-current' : ''}`} />
                            {post.featured ? "مميز" : "تمييز"}
                          </Button>
                          
                          {/* Delete Button */}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedPost(post)
                              setDeleteDialogOpen(true)
                            }}
                            className="h-8 px-2 text-xs"
                          >
                            <Trash2 className="w-3 h-3 ml-1" />
                            حذف
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPosts.map((post) => (
                <Card key={post._id} className={`relative ${bulkActions.includes(post._id) ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Checkbox
                        checked={bulkActions.includes(post._id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBulkActions([...bulkActions, post._id])
                          } else {
                            setBulkActions(bulkActions.filter(id => id !== post._id))
                          }
                        }}
                      />
                      <Badge variant={post.published ? "default" : "secondary"} className="font-arabic text-xs">
                        {post.published ? "منشور" : "مسودة"}
                      </Badge>
                    </div>

                    {post.image && (
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {post.featured && (
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        )}
                        <h3 className="font-semibold font-arabic line-clamp-2 text-sm leading-tight">
                          {post.title}
                        </h3>
                      </div>
                      
                      <p className="text-xs text-muted-foreground font-arabic line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="font-arabic">
                          {post.category}
                        </Badge>
                        <span>{formatDate(post.createdAt)}</span>
                        {post.views && <span>• {post.views} مشاهدة</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {/* Preview Button */}
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button size="sm" variant="outline" className="text-xs h-8 font-arabic w-full">
                            <Eye className="w-3 h-3 ml-1" />
                            معاينة
                          </Button>
                        </Link>
                        
                        {/* Edit Button */}
                        <Link href={`/admin/posts/edit?id=${post._id}`}>
                          <Button size="sm" variant="outline" className="text-xs h-8 font-arabic w-full">
                            <Edit className="w-3 h-3 ml-1" />
                            تعديل
                          </Button>
                        </Link>
                        
                        {/* Publish/Unpublish Button */}
                        <Button
                          size="sm"
                          variant={post.published ? "outline" : "default"}
                          className="text-xs h-8 font-arabic w-full"
                          onClick={() => togglePublishStatus(post._id)}
                        >
                          {post.published ? "إخفاء" : "نشر"}
                        </Button>
                        
                        {/* Delete Button */}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-xs h-8 font-arabic w-full"
                          onClick={() => {
                            setSelectedPost(post)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-3 h-3 ml-1" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="font-arabic max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف المقال "{selectedPost?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedPost && handleDeletePost(selectedPost._id)}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              حذف المقال
            </Button>
          </DialogFooter>
        </DialogContent>  
      </Dialog>
    </div>
  )
}