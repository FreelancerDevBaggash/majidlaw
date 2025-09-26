// components/blog-card.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BlogPost } from "@/lib/blog-data"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  // تنسيق التاريخ
  const formattedDate = new Date(post.date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="font-arabic">
            {post.category}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <h3 className="text-xl font-bold font-arabic text-balance group-hover:text-primary transition-colors">
          {post.title}
        </h3>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-pretty leading-relaxed mb-4">{post.excerpt}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} دقائق</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/blog/${post.slug}`} className="w-full">
          <Button className="w-full font-arabic">قراءة المقال</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}