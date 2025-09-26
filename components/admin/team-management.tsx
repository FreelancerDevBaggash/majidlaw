 "use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Filter, 
  Star, 
  Mail,
  Phone,
  RefreshCw,
  CheckCircle,
  XCircle,
  Grid,
  List,
  MoreVertical,
  Award,
  Languages,
  Calendar,
  Settings
} from "lucide-react"
import { TeamMemberType } from "@/lib/team"

const specializations = [
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

const statusOptions = [
  { value: "all", label: "جميع الحالات", icon: User },
  { value: "active", label: "نشط فقط", icon: CheckCircle },
  { value: "inactive", label: "غير نشط", icon: XCircle },
  { value: "featured", label: "مميز", icon: Star }
]

const sortOptions = [
  { value: "date", label: "أحدث الإضافات" },
  { value: "name", label: "الاسم (أ-ي)" },
  { value: "featured", label: "المميزين أولاً" }
]

export function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMemberType | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [sortBy, setSortBy] = useState<"name" | "date" | "featured">("date")
  const [isMobile, setIsMobile] = useState(false)

  // الكشف عن نوع الجهاز وإدارة وضع العرض التلقائي
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // إذا كان الجوال، استخدم العرض الشبكي افتراضيًا
      if (mobile && viewMode === "table") {
        setViewMode("grid")
      }
      // إذا كان كمبيوتر وكان العرض شبكي (ربما بسبب تغيير سابق)، ارجع للجدول
      else if (!mobile && viewMode === "grid") {
        setViewMode("table")
      }
    }

    // التحقق الأولي
    checkMobile()
    
    // الاستماع لتغييرات حجم النافذة
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [viewMode]) // أضف viewMode كاعتماد

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (selectedSpecialization !== "all") params.append("specialization", selectedSpecialization)
      if (selectedStatus !== "all") params.append("status", selectedStatus)
      params.append("sort", sortBy)

      const res = await fetch(`/api/team?${params}`)
      if (!res.ok) throw new Error("فشل في جلب البيانات")
      const data = await res.json()
      setTeamMembers(data.teamMembers || [])
    } catch (err) {
      console.error("خطأ في جلب أعضاء الفريق:", err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [searchQuery, selectedSpecialization, selectedStatus, sortBy])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchTeamMembers()
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("فشل في حذف عضو الفريق")
      setTeamMembers(teamMembers.filter(m => m._id !== id))
      setDeleteDialogOpen(false)
      setSelectedMember(null)
    } catch (err) {
      console.error("خطأ في حذف العضو:", err)
    }
  }

  const toggleFeatured = async (id: string) => {
    try {
      const member = teamMembers.find(m => m._id === id)
      if (!member) return

      const res = await fetch(`/api/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !member.featured }),
      })
      
      if (!res.ok) throw new Error("فشل في تحديث عضو الفريق")
      
      setTeamMembers(teamMembers.map(m => 
        m._id === id ? { ...m, featured: !m.featured } : m
      ))
    } catch (err) {
      console.error("خطأ في تحديث التميز:", err)
    }
  }

  const toggleActive = async (id: string) => {
    try {
      const member = teamMembers.find(m => m._id === id)
      if (!member) return

      const res = await fetch(`/api/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !member.active }),
      })
      
      if (!res.ok) throw new Error("فشل في تحديث عضو الفريق")
      
      setTeamMembers(teamMembers.map(m => 
        m._id === id ? { ...m, active: !m.active } : m
      ))
    } catch (err) {
      console.error("خطأ في تحديث الحالة:", err)
    }
  }

  // دالة لتغيير وضع العرض مع مراعاة نوع الجهاز
  const changeViewMode = (mode: "table" | "grid") => {
    setViewMode(mode)
    
    // حفظ التفضيل في localStorage (اختياري)
    if (typeof window !== 'undefined') {
      localStorage.setItem('team-view-mode', mode)
    }
  }

  // تصفية الأعضاء بناءً على الحالة المختارة
  const filteredMembers = teamMembers.filter(member => {
    if (selectedStatus === "active") return member.active
    if (selectedStatus === "inactive") return !member.active
    if (selectedStatus === "featured") return member.featured
    return true
  })

  // تصنيف الأعضاء
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name, 'ar')
      case "featured":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case "date":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // تنسيق التاريخ بالعربية
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">إدارة فريق العمل</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">إدارة وتنظيم أعضاء فريق المكتب المحامي</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} size={isMobile ? "sm" : "default"}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">تحديث</span>
          </Button>
          
          {/* أزرار عرض/جدولة - مخفية على الجوال الصغير جداً */}
          <div className={`flex gap-2 ${isMobile ? 'hidden xs:flex' : 'flex'}`}>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              onClick={() => changeViewMode("table")}
              size={isMobile ? "sm" : "default"}
              disabled={isMobile} // تعطيل على الجوال لأن العرض الجدولي غير عملي
            >
              <List className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">عرض الجدول</span>
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => changeViewMode("grid")}
              size={isMobile ? "sm" : "default"}
            >
              <Grid className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">عرض الشبكة</span>
            </Button>
          </div>
          
          <Link href="/admin/team/new">
            <Button size={isMobile ? "sm" : "default"}>
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">إضافة عضو جديد</span>
              <span className="sm:hidden">عضو جديد</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg lg:text-xl">البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {/* شريط البحث */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في أسماء الأعضاء، المناصب، أو الوصف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm lg:text-base"
              />
            </div>
            
            {/* عوامل التصفية - تكيف مع حجم الشاشة */}
            <div className={`grid gap-3 ${
              isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'
            }`}>
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger className="text-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="جميع التخصصات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التخصصات</SelectItem>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="text-sm">
                  <User className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="text-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الإحصائيات - تكيف مع حجم الشاشة */}
      <div className={`grid gap-3 lg:gap-4 ${
        isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'
      }`}>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">إجمالي الأعضاء</p>
                <p className="text-xl lg:text-2xl font-bold">{teamMembers.length}</p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-100 rounded-full">
                <User className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">نشط</p>
                <p className="text-xl lg:text-2xl font-bold">{teamMembers.filter(m => m.active).length}</p>
              </div>
              <div className="p-2 lg:p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-4 h-4 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">مميز</p>
                <p className="text-xl lg:text-2xl font-bold">{teamMembers.filter(m => m.featured).length}</p>
              </div>
              <div className="p-2 lg:p-3 bg-yellow-100 rounded-full">
                <Star className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">غير نشط</p>
                <p className="text-xl lg:text-2xl font-bold">{teamMembers.filter(m => !m.active).length}</p>
              </div>
              <div className="p-2 lg:p-3 bg-red-100 rounded-full">
                <XCircle className="w-4 h-4 lg:w-6 lg:h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* محتوى أعضاء الفريق */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg lg:text-xl">أعضاء الفريق ({sortedMembers.length})</CardTitle>
              <CardDescription className="text-sm lg:text-base">
                قائمة بجميع أعضاء فريق المكتب المحامي
              </CardDescription>
            </div>
            
            {/* تحكم العرض - مخفي على الجوال الصغير */}
            <div className={`flex gap-2 ${isMobile ? 'hidden xs:flex' : 'flex'}`}>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                onClick={() => changeViewMode("table")}
                size="sm"
                disabled={isMobile}
              >
                <List className="w-4 h-4" />
                {!isMobile && <span className="mr-2">جدول</span>}
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => changeViewMode("grid")}
                size="sm"
              >
                <Grid className="w-4 h-4" />
                {!isMobile && <span className="mr-2">شبكة</span>}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground text-sm lg:text-base">جارٍ تحميل الأعضاء...</p>
            </div>
          ) : sortedMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 lg:h-16 lg:w-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-base lg:text-lg mb-2">لا توجد أعضاء</p>
              <p className="text-xs lg:text-sm mb-4">
                {searchQuery || selectedSpecialization !== "all" || selectedStatus !== "all" 
                  ? "جرب تعديل عوامل التصفية"
                  : "ابدأ بإضافة أول عضو في الفريق"
                }
              </p>
              <Link href="/admin/team/new">
                <Button size={isMobile ? "sm" : "default"}>
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة عضو جديد
                </Button>
              </Link>
            </div>
          ) : viewMode === "table" && !isMobile ? (
            // عرض الجدول (للشاشات الكبيرة فقط)
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm min-w-[200px]">العضو</TableHead>
                    <TableHead className="text-xs lg:text-sm">المنصب</TableHead>
                    <TableHead className="text-xs lg:text-sm">التخصص</TableHead>
                    <TableHead className="text-xs lg:text-sm">الحالة</TableHead>
                    <TableHead className="text-xs lg:text-sm text-center min-w-[120px]">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMembers.map((member) => (                    
                    <TableRow key={member._id}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          {member.image ? (
                            <img 
                              src={member.image} 
                              alt={member.name}
                              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {member.featured && (
                                <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                              )}
                              <div className="font-medium text-sm lg:text-base truncate">{member.name}</div>
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">{member.bio}</div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">{member.position}</div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {member.specialization?.slice(0, 2).map((spec, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {member.specialization && member.specialization.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{member.specialization.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Badge className={`text-xs w-fit ${
                            member.active 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {member.active ? "نشط" : "غير نشط"}
                          </Badge>
                          <Switch
                            checked={member.active}
                            onCheckedChange={() => toggleActive(member._id)}
                            className="scale-90"
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant={member.featured ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleFeatured(member._id)}
                            className="h-8"
                            title={member.featured ? "إلغاء التميز" : "تمييز"}
                          >
                            <Star className={`w-3 h-3 ${member.featured ? 'fill-current' : ''}`} />
                          </Button>
                          
                          <Link href={`/team/edit?id=${member._id}`}>
                            <Button variant="outline" size="sm" className="h-8" title="تعديل">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </Link>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              setSelectedMember(member)
                              setDeleteDialogOpen(true)
                            }}
                            title="حذف"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            // عرض الشبكة (للجوال والكمبيوتر)
            <div className={`grid gap-4 lg:gap-6 ${
              isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            }`}>
              {sortedMembers.map((member) => (
                <Card key={member._id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 lg:p-6">
                    {/* صورة العضو ومعلوماته */}
                    <div className="flex items-center gap-3 mb-4">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {member.featured && (
                            <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                          <h3 className="font-bold text-sm lg:text-base truncate">{member.name}</h3>
                        </div>
                        <p className="text-accent font-medium text-xs lg:text-sm truncate">{member.position}</p>
                      </div>
                    </div>

                    {/* الوصف */}
                    <p className="text-muted-foreground text-xs lg:text-sm line-clamp-2 mb-3 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* التخصصات */}
                    {member.specialization && member.specialization.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {member.specialization.slice(0, 2).map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {member.specialization.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.specialization.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* معلومات إضافية */}
                    <div className="space-y-2 text-xs text-muted-foreground">
                      {member.experience && (
                        <div className="flex items-center gap-2">
                          <Award className="w-3 h-3" />
                          <span>{member.experience}</span>
                        </div>
                      )}
                      
                      {member.languages && member.languages.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Languages className="w-3 h-3" />
                          <span>{member.languages.slice(0, 2).join('، ')}</span>
                        </div>
                      )}
                    </div>

                    {/* الحالة والإجراءات */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${
                          member.active 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {member.active ? "نشط" : "غير نشط"}
                        </Badge>
                        {!isMobile && (
                          <Switch
                            checked={member.active}
                            onCheckedChange={() => toggleActive(member._id)}
                            className="scale-75"
                          />
                        )}
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant={member.featured ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFeatured(member._id)}
                          className="h-6 w-6 p-0"
                          title={member.featured ? "إلغاء التميز" : "تمييز"}
                        >
                          <Star className={`w-3 h-3 ${member.featured ? 'fill-current' : ''}`} />
                        </Button>
                        
                        <Link href={`/team/edit?id=${member._id}`}>
                          <Button variant="outline" size="sm" className="h-6 w-6 p-0" title="تعديل">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </Link>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            setSelectedMember(member)
                            setDeleteDialogOpen(true)
                          }}
                          title="حذف"
                        >
                          <Trash2 className="w-3 h-3" />
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

      {/* نافذة تأكيد الحذف */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-lg lg:text-xl">تأكيد الحذف</DialogTitle>
            <DialogDescription className="text-sm lg:text-base">
              هل أنت متأكد من رغبتك في حذف العضو "{selectedMember?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedMember && handleDelete(selectedMember._id)}
              className="w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              حذف العضو
            </Button>
          </DialogFooter>
        </DialogContent>  
      </Dialog>
    </div>
  )
}