"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import Link from "next/link"

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  slug: string
  category: string
  published: boolean
  date: string
  readTime: number
}

export function BlogPreviewSection() {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/admin/posts") // أو المسار الذي يعرض المقالات المنشورة
        const data = await res.json()
        if (data.posts) {
          // ترتيب حسب التاريخ وأخذ آخر 3 مقالات منشورة
          const publishedPosts = data.posts
            .filter((post: BlogPost) => post.published)
            .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
          setLatestPosts(publishedPosts)
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-muted/30 text-center">
        <div className="absolute top-10 right-10 text-8xl font-bold text-primary/10 select-none floating-animation">م</div>

        <p className="text-muted-foreground">جارٍ تحميل المقالات...</p>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/30">

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">المدونة القانونية</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            آخر المقالات والتحديثات القانونية من مكتبنا لمساعدتك في فهم حقوقك والتزاماتك القانونية
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {latestPosts.map((post) => (
            <Card key={post._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Icons.Clock className="w-4 h-4" />
                    <span>{post.readTime} دقائق</span>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icons.Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString("ar-SA")}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" size="sm" className="group-hover:text-accent">
                      اقرأ المزيد
                      <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              عرض جميع المقالات
              <Icons.ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
