"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  category: string
  date: string
  published: boolean
}

interface Comment {
  _id: string
  postId: { title: string } | string
  name: string
  email: string
  content: string
  approved: boolean
  createdAt: string
}

export function AdminDashboard() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingComments, setLoadingComments] = useState(true)

  useEffect(() => {
    // جلب المقالات
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true)
        const res = await fetch("/api/admin/posts")
        const data = await res.json()
        setBlogPosts(data.posts || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingPosts(false)
      }
    }

    // جلب التعليقات
    const fetchComments = async () => {
      try {
        setLoadingComments(true)
        const res = await fetch("/api/admin/comments")
        const data = await res.json()
        setComments(data.comments || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingComments(false)
      }
    }

    fetchPosts()
    fetchComments()
  }, [])

  const publishedPosts = blogPosts.filter((post) => post.published)
  const draftPosts = blogPosts.filter((post) => !post.published)

  const stats = [
    {
      title: "إجمالي المقالات",
      value: blogPosts.length,
      icon: Icons.FileText,
      description: "جميع المقالات المنشورة والمسودات",
    },
    {
      title: "المقالات المنشورة",
      value: publishedPosts.length,
      icon: Icons.BarChart,
      description: "المقالات المتاحة للقراء",
    },
    {
      title: "المسودات",
      value: draftPosts.length,
      icon: Icons.Edit,
      description: "المقالات قيد التحرير",
    },
    {
      title: "التعليقات",
      value: comments.length,
      icon: Icons.MessageCircle,
      description: "جميع التعليقات",
    },
  ]

  return (
    <div className="w-full max-w-full">
      <div className="space-y-6 p-2 sm:p-3 md:p-4 lg:p-6">
        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link href="/admin/posts/new" className="w-full sm:w-auto">
            <Button className="font-arabic flex items-center gap-2 w-full sm:w-auto justify-center">
              <Icons.Plus className="w-4 h-4" />
              مقال جديد
            </Button>
          </Link>
          <Link href="/admin/posts" className="w-full sm:w-auto">
            <Button variant="outline" className="font-arabic flex items-center gap-2 w-full sm:w-auto justify-center">
              <Icons.FileText className="w-4 h-4" />
              إدارة المقالات
            </Button>
          </Link>
          <Link href="/admin/comments" className="w-full sm:w-auto">
            <Button variant="outline" className="font-arabic flex items-center gap-2 w-full sm:w-auto justify-center">
              <Icons.MessageCircle className="w-4 h-4" />
              إدارة التعليقات
            </Button>
          </Link>
          <Link href="/admin/cases" className="w-full sm:w-auto">
            <Button variant="outline" className="font-arabic flex items-center gap-2 w-full sm:w-auto justify-center">
              <Icons.MessageCircle className="w-4 h-4" />
              إدارة الفريق 
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
                <CardTitle className="text-sm font-medium font-arabic">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground font-arabic mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Posts */}
        <Card className="w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="font-arabic text-lg sm:text-xl">المقالات الأخيرة</CardTitle>
            <CardDescription className="font-arabic text-sm sm:text-base">
              آخر المقالات التي تم إنشاؤها أو تعديلها
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {loadingPosts ? (
              <div className="text-center py-8 font-arabic">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">جاري تحميل المقالات...</p>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-8 font-arabic text-muted-foreground">
                <Icons.FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">لا توجد مقالات</p>
                <Link href="/admin/posts/new">
                  <Button className="mt-4 font-arabic">
                    <Icons.Plus className="w-4 h-4 ml-2" />
                    إنشاء مقال جديد
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {blogPosts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold font-arabic text-sm sm:text-base line-clamp-2">{post.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground font-arabic mt-1">
                        {post.category} • {post.date}
                      </p>
                    </div>
                    <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 w-full sm:w-auto">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-arabic whitespace-nowrap ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "منشور" : "مسودة"}
                      </span>
                      <Link href={`/admin/posts/${post.id}/edit`} className="w-full xs:w-auto">
                        <Button variant="ghost" size="sm" className="w-full xs:w-auto justify-center">
                          <Icons.Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="mr-1 hidden xs:inline">تعديل</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}