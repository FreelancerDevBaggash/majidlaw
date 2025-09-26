"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  MessageCircle, 
  User, 
  Send, 
  Calendar,
  Mail,
  ThumbsUp,
  CheckCircle,
  AlertCircle,
  Edit
} from "lucide-react"

interface Comment {
  _id: string
  name: string
  email: string
  content: string
  approved: boolean
  createdAt: string
  isAdmin?: boolean
  likes?: number
  userLiked?: boolean
  replies?: Comment[]
  parentId?: string
}

interface BlogCommentsProps {
  postId: string
  postTitle?: string
}

export function BlogComments({ postId, postTitle }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    content: "",
  })

  // جلب التعليقات من API
  const fetchComments = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/comments?postId=${postId}&approved=true`)
      if (!res.ok) throw new Error("حدث خطأ أثناء جلب التعليقات")
      
      const data = await res.json()
      setComments(data.comments || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  // إرسال تعليق جديد فقط
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    
    try {
      const res = await fetch("/api/admin/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          postId, 
          ...newComment,
          postTitle
        }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "حدث خطأ أثناء إرسال التعليق")
      }
      
      const data = await res.json()
      setNewComment({ name: "", email: "", content: "" })
      setComments(prev => [data.comment, ...prev])
      setSuccess("تم إرسال تعليقك بنجاح وسيظهر بعد المراجعة")
      setTimeout(() => setSuccess(""), 5000)
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(""), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  // إعجاب بالتعليق (للقراءة فقط)
  const handleLikeComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api//admin/comments/${commentId}/like`, {
        method: "POST",
      })
      
      if (res.ok) {
        setComments(prev => prev.map(comment => 
          comment._id === commentId 
            ? { 
                ...comment, 
                likes: (comment.likes || 0) + (comment.userLiked ? -1 : 1),
                userLiked: !comment.userLiked
              }
            : comment
        ))
      }
    } catch (err) {
      console.error("Error liking comment:", err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // مكون التعليق الفردي (للعرض فقط)
  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`space-y-3 ${depth > 0 ? 'ml-6 lg:ml-8 pl-4 lg:pl-6 border-r-2 border-muted' : ''}`}>
      <Card className={`${depth > 0 ? 'bg-muted/30' : ''}`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            {/* صورة المستخدم */}
            <div className={`flex-shrink-0 ${
              comment.isAdmin 
                ? 'bg-gradient-to-br from-blue-100 to-blue-200' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200'
            } rounded-full p-2`}>
              <User className={`w-4 h-4 ${
                comment.isAdmin ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>

            <div className="flex-1 min-w-0">
              {/* رأس التعليق */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold font-arabic text-sm lg:text-base">
                    {comment.name}
                  </h4>
                  {comment.isAdmin && (
                    <Badge variant="secondary" className="text-xs">
                      مدير
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </div>

              {/* محتوى التعليق */}
              <p className="text-foreground font-arabic leading-relaxed text-sm lg:text-base mb-3">
                {comment.content}
              </p>

              {/* إجراءات التعليق (إعجاب فقط) */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment._id)}
                  className={`h-8 gap-1 ${
                    comment.userLiked ? 'text-blue-600' : 'text-muted-foreground'
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 ${comment.userLiked ? 'fill-current' : ''}`} />
                  <span className="text-xs">{comment.likes || 0}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الردود (للعرض فقط) */}
      {comment.replies && comment.replies.map(reply => (
        <CommentItem key={reply._id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  )

  return (
    <section className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
          <h2 className="text-2xl lg:text-3xl font-bold font-arabic">التعليقات ({comments.length})</h2>
        </div>
        <p className="text-muted-foreground font-arabic">
          شاركنا رأيك وكن جزءاً من النقاش
        </p>
      </div>

      {/* التنبيهات */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-arabic">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="font-arabic text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* قائمة التعليقات */}
      <div className="space-y-6">
        {loading ? (
          // حالة التحميل
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : comments.length === 0 ? (
          // لا توجد تعليقات
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="font-arabic text-muted-foreground">لا توجد تعليقات بعد</p>
              <p className="font-arabic text-sm text-muted-foreground mt-1">
                كن أول من يعلق على هذا المقال
              </p>
            </CardContent>
          </Card>
        ) : (
          // عرض التعليقات
          <div className="space-y-6">
            {comments.filter(comment => !comment.parentId).map(comment => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>
        )}
      </div>

      {/* نموذج إضافة تعليق جديد فقط */}
      <Card className="sticky bottom-4 lg:bottom-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader>
          <CardTitle className="font-arabic flex items-center gap-2">
            <Edit className="w-5 h-5" />
            اكتب تعليقك
          </CardTitle>
          <CardDescription className="font-arabic">
            رأيك يهمنا! شاركنا أفكارك وملاحظاتك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-arabic text-sm">الاسم *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="اسمك الكامل"
                  value={newComment.name}
                  onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="font-arabic text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-arabic text-sm">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={newComment.email}
                  onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="font-arabic text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="font-arabic text-sm">التعليق *</Label>
              <Textarea
                id="content"
                placeholder="ما رأيك في هذا المقال؟ شاركنا أفكارك..."
                rows={4}
                value={newComment.content}
                onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                required
                className="font-arabic text-sm resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-arabic">
                سيظهر تعليقك بعد المراجعة
              </p>
              <Button 
                type="submit" 
                disabled={submitting}
                className="font-arabic gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? "جاري الإرسال..." : "إرسال التعليق"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}