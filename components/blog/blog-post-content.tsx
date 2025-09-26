import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowRight, Tag, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { BlogPost } from "@/lib/blog-data"

interface BlogPostContentProps {
  post: BlogPost
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  // دالة لتحويل تاريخ MongoDB إلى تنسيق عربي
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  // دالة لعرض محتوى المقال مع تنسيق HTML
  const renderContent = (content: string) => {
    if (!content) {
      return (
        <div className="space-y-6 text-foreground">
          <p>
            هذا نص تجريبي لمحتوى المقال. في التطبيق الفعلي، سيتم استبدال هذا النص بالمحتوى الحقيقي للمقال. يمكن أن يحتوي
            المقال على عدة فقرات وعناوين فرعية وقوائم ونقاط مهمة.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">النقاط الرئيسية</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>النقطة الأولى المهمة في الموضوع</li>
            <li>النقطة الثانية التي تحتاج إلى توضيح</li>
            <li>النقطة الثالثة والأخيرة في هذا القسم</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">التفاصيل القانونية</h2>
          <p>
            تفاصيل قانونية مهمة حول الموضوع. هذا القسم يحتوي على معلومات متخصصة تساعد القارئ على فهم الجوانب القانونية
            بشكل أفضل.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">الخلاصة</h2>
          <p>
            خلاصة المقال والنصائح النهائية للقراء. هذا القسم يلخص أهم النقاط ويقدم توصيات عملية يمكن للقراء تطبيقها.
          </p>
        </div>
      )
    }

    // تقسيم المحتوى إلى فقرات بناءً على الأسطر الجديدة
    const paragraphs = content.split('\n').filter(p => p.trim())

    return (
      <div className="space-y-6 text-foreground">
        {paragraphs.map((paragraph, index) => {
          // التحقق إذا كان الفقرة عنوانًا (تبدأ بـ ## أو ###)
          if (paragraph.trim().startsWith('## ')) {
            return (
              <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-primary">
                {paragraph.replace('## ', '')}
              </h2>
            )
          } else if (paragraph.trim().startsWith('### ')) {
            return (
              <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-primary">
                {paragraph.replace('### ', '')}
              </h3>
            )
          } else if (paragraph.trim().startsWith('- ')) {
            // قائمة نقطية
            const listItems = paragraph.split('\n').filter(item => item.trim().startsWith('- '))
            return (
              <ul key={index} className="list-disc list-inside space-y-2">
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex}>{item.replace('- ', '')}</li>
                ))}
              </ul>
            )
          } else {
            return (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            )
          }
        })}
      </div>
    )
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Back Button */}
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="font-arabic gap-2">
            <ArrowRight className="w-4 h-4" />
            العودة للمدونة
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="secondary" className="font-arabic text-sm">
            {post.category}
          </Badge>
          
          {/* حالة النشر */}
          {!post.published && (
            <Badge variant="outline" className="font-arabic text-sm bg-yellow-50 text-yellow-700">
              <Eye className="w-3 h-3 ml-1" />
              مسودة
            </Badge>
          )}
          
          {/* الوسوم */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="font-arabic text-xs">
                  <Tag className="w-3 h-3 ml-1" />
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="font-arabic text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-arabic text-balance mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="font-arabic">{post.author}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span className="font-arabic">
              {post.createdAt ? formatDate(post.createdAt) : post.date}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="font-arabic">{post.readTime || 5} دقائق قراءة</span>
          </div>

          {/* تاريخ التحديث إذا كان مختلفًا عن تاريخ الإنشاء */}
          {post.updatedAt && post.createdAt && post.updatedAt !== post.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-arabic text-sm">
                محدث: {formatDate(post.updatedAt)}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="relative h-80 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
          <Image 
            src={post.image || "/placeholder.svg"} 
            alt={post.title} 
            fill 
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none font-arabic leading-relaxed">
        {/* المقدمة */}
        <div className="bg-muted/50 p-6 rounded-xl mb-8 border-r-4 border-primary">
          <p className="text-xl text-foreground mb-0 text-pretty leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* محتوى المقال */}
        {renderContent(post.content)}

        {/* الوسوم الكاملة */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-muted-foreground">وسوم المقال</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="font-arabic">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold mb-2">معلومات المقال</h4>
              <ul className="space-y-1">
                <li className="flex justify-between">
                  <span>تاريخ النشر:</span>
                  <span>{post.createdAt ? formatDate(post.createdAt) : post.date}</span>
                </li>
                <li className="flex justify-between">
                  <span>آخر تحديث:</span>
                  <span>{post.updatedAt ? formatDate(post.updatedAt) : 'لم يتم التحديث'}</span>
                </li>
                <li className="flex justify-between">
                  <span>وقت القراءة:</span>
                  <span>{post.readTime || 5} دقيقة</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">التصنيفات</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="font-arabic">
                  {post.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* زر العودة */}
        <div className="mt-12 text-center">
          <Link href="/blog">
            <Button variant="outline" className="font-arabic gap-2">
              <ArrowRight className="w-4 h-4" />
              العودة إلى المدونة
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}