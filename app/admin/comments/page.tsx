"use client"

import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, Send, Search, Filter, MoreVertical, MessageSquare, User, Mail, Calendar, FileText, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"

interface CommentType {
  _id: string
  postId: { 
    _id: string
    title: string
    slug: string
  } | null
  name: string
  email: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  isAdminReply?: boolean
  parentId?: string
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchComments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      
      const res = await fetch(`/api/admin/comments?${params}`)
      if (!res.ok) throw new Error("فشل في جلب التعليقات")
      
      const data = await res.json()
      setComments(data.comments || [])
    } catch (err) {
      console.error(err)
      setError("خطأ في جلب التعليقات")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("فشل في حذف التعليق")
      
      setComments(prev => prev.filter(c => c._id !== id))
      setDeleteDialogOpen(false)
      setSelectedComment(null)
      setSuccess("تم حذف التعليق بنجاح")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleReply = async (commentId: string, postId: string) => {
    const content = replyContent[commentId]?.trim()
    if (!content) return

    try {
      const res = await fetch("/api/admin/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          name: "مدير النظام",
          email: "admin@lawfirm.com",
          content,
          isAdminReply: true,
          parentId: commentId
        }),
      })
      
      if (!res.ok) throw new Error("فشل في إرسال الرد")
      
      setReplyContent(prev => ({ ...prev, [commentId]: "" }))
      setSuccess("تم إرسال الرد بنجاح")
      setTimeout(() => setSuccess(""), 3000)
      fetchComments()
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(""), 3000)
    }
  }

  const updateCommentStatus = async (commentId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      
      if (!res.ok) throw new Error("فشل في تحديث حالة التعليق")
      
      setComments(prev => prev.map(comment =>
        comment._id === commentId ? { ...comment, status } : comment
      ))
      setSuccess(`تم ${status === 'approved' ? 'الموافقة على' : 'رفض'} التعليق`)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchComments()
  }

  useEffect(() => {
    fetchComments()
  }, [searchQuery, statusFilter])

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    }
    
    const labels = {
      pending: "قيد المراجعة",
      approved: "مقبول",
      rejected: "مرفوض"
    }

    return (
      <Badge className={`text-xs ${variants[status as keyof typeof variants]}`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
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

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.postId?.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 lg:ml-64 p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-6 w-full">
              {/* Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold font-arabic">إدارة التعليقات</h1>
                  <p className="text-muted-foreground mt-2 font-arabic">عرض، حذف، والرد على جميع التعليقات</p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                    <RefreshCw className={`w-4 h-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    تحديث
                  </Button>
                </div>
              </div>

              {/* Alerts */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="font-arabic text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-arabic">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Stats and Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <Card className="w-full">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">إجمالي التعليقات</p>
                        <p className="text-2xl font-bold">{comments.length}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">قيد المراجعة</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {comments.filter(c => c.status === 'pending').length}
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">مقبولة</p>
                        <p className="text-2xl font-bold text-green-600">
                          {comments.filter(c => c.status === 'approved').length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">مرفوضة</p>
                        <p className="text-2xl font-bold text-red-600">
                          {comments.filter(c => c.status === 'rejected').length}
                        </p>
                      </div>
                      <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filters */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="font-arabic">البحث والتصفية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="ابحث في التعليقات..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10 w-full"
                      />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full">
                        <Filter className="h-4 w-4 ml-2" />
                        <SelectValue placeholder="حالة التعليق" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="pending">قيد المراجعة</SelectItem>
                        <SelectItem value="approved">مقبولة</SelectItem>
                        <SelectItem value="rejected">مرفوضة</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="text-sm text-muted-foreground font-arabic flex items-center justify-center lg:justify-start">
                      عرض {filteredComments.length} من {comments.length} تعليق
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments List */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="font-arabic">قائمة التعليقات</CardTitle>
                  <CardDescription className="font-arabic">
                    إدارة جميع تعليقات الزوار على المقالات
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground font-arabic">جاري تحميل التعليقات...</p>
                    </div>
                  ) : filteredComments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-arabic">لا توجد تعليقات</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredComments.map(comment => (
                        <div key={comment._id} className="border rounded-lg p-3 lg:p-4 space-y-3 w-full">
                          {/* Comment Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-3">
                            <div className="flex items-start gap-3 w-full">
                              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-2 mt-1 flex-shrink-0">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="font-semibold text-sm lg:text-base">{comment.name}</span>
                                  <div className="flex flex-wrap gap-1">
                                    {comment.isAdminReply && (
                                      <Badge variant="secondary" className="text-xs">رد إداري</Badge>
                                    )}
                                    {getStatusBadge(comment.status)}
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate">{comment.email}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(comment.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 self-end sm:self-start">
                              {/* Delete Button */}
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  setSelectedComment(comment)
                                  setDeleteDialogOpen(true)
                                }}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline">حذف</span>
                              </Button>

                              {/* Status Actions Dropdown */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {comment.status !== 'approved' && (
                                    <DropdownMenuItem onClick={() => updateCommentStatus(comment._id, 'approved')}>
                                      <CheckCircle className="h-4 w-4 ml-2" />
                                      قبول التعليق
                                    </DropdownMenuItem>
                                  )}
                                  {comment.status !== 'rejected' && (
                                    <DropdownMenuItem onClick={() => updateCommentStatus(comment._id, 'rejected')}>
                                      <Trash2 className="h-4 w-4 ml-2" />
                                      رفض التعليق
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Article Info */}
                          {comment.postId && (
                            <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
                              <FileText className="h-3 w-3 flex-shrink-0" />
                              <span className="font-medium">المقال:</span>
                              <span className="text-muted-foreground truncate">{comment.postId.title}</span>
                            </div>
                          )}

                          {/* Comment Content */}
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <p className="text-sm leading-relaxed break-words">{comment.content}</p>
                          </div>

                          {/* Reply Section */}
                          <div className="space-y-2">
                            <Textarea
                              rows={2}
                              placeholder="اكتب ردك هنا..."
                              value={replyContent[comment._id] || ""}
                              onChange={e => setReplyContent(prev => ({
                                ...prev,
                                [comment._id]: e.target.value,
                              }))}
                              className="resize-none w-full"
                            />
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                الرد سيكون باسم "مدير النظام"
                              </span>
                              <Button
                                size="sm"
                                onClick={() => handleReply(comment._id, comment.postId?._id || "")}
                                disabled={!replyContent[comment._id]?.trim()}
                                className="w-full sm:w-auto"
                              >
                                <Send className="w-4 h-4 ml-2" />
                                إرسال الرد
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="font-arabic">تأكيد الحذف</DialogTitle>
              <DialogDescription className="font-arabic">
                هل أنت متأكد من رغبتك في حذف تعليق {selectedComment?.name}؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="w-full sm:w-auto">
                إلغاء
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedComment && handleDelete(selectedComment._id)}
                className="w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 ml-2" />
                حذف التعليق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
} 