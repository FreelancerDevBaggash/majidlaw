// components/admin/cases-management.tsx
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  Filter, 
  Download, 
  Star, 
  User,
  Building,
  Gavel,
  Users,
  Trophy,
  Home,
  Briefcase,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { CaseType } from "@/lib/case"

const caseTypes = [
  { value: "تجاري", label: "تجاري", icon: Building },
  { value: "مدني", label: "مدني", icon: Users },
  { value: "تحكيم", label: "تحكيم", icon: Gavel },
  { value: "جنائي", label: "جنائي", icon: Trophy },
  { value: "أسرة", label: "أسرة", icon: Home },
  { value: "عمل", label: "عمل", icon: Briefcase }
]

const statusTypes = [
  { value: "مكتملة", label: "مكتملة", color: "bg-green-100 text-green-800" },
  { value: "جارية", label: "جارية", color: "bg-yellow-100 text-yellow-800" },
  { value: "ملغاة", label: "ملغاة", color: "bg-red-100 text-red-800" }
]

export function CasesManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cases, setCases] = useState<CaseType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<CaseType | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchCases = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (selectedType !== "all") params.append("type", selectedType)
      if (selectedStatus !== "all") params.append("status", selectedStatus)

      const res = await fetch(`/api/admin/cases?${params}`)
      if (!res.ok) throw new Error("فشل في جلب البيانات")
      const data = await res.json()
      setCases(data.cases || [])
    } catch (err) {
      console.error("Error fetching cases:", err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [searchQuery, selectedType, selectedStatus])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchCases()
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/cases/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("فشل في حذف القضية")
      setCases(cases.filter(c => c._id !== id))
      setDeleteDialogOpen(false)
      setSelectedCase(null)
    } catch (err) {
      console.error("Error deleting case:", err)
    }
  }

  const toggleFeatured = async (id: string) => {
    try {
      const caseItem = cases.find(c => c._id === id)
      if (!caseItem) return

      const res = await fetch(`/api/admin/cases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !caseItem.featured }),
      })
      
      if (!res.ok) throw new Error("فشل في تحديث القضية")
      
      setCases(cases.map(c => 
        c._id === id ? { ...c, featured: !c.featured } : c
      ))
    } catch (err) {
      console.error("Error updating case:", err)
    }
  }

  const getTypeIcon = (type: string) => {
    const foundType = caseTypes.find(t => t.value === type)
    return foundType ? foundType.icon : Building
  }

  const getStatusBadge = (status: string) => {
    const foundStatus = statusTypes.find(s => s.value === status)
    return foundStatus || statusTypes[0]
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-arabic">إدارة القضايا</h1>
          <p className="text-muted-foreground font-arabic mt-1">إدارة وتنظيم سجل القضايا والنجاحات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Link href="/admin/cases/new">
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              قضية جديدة
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث في عناوين القضايا، العملاء، أو الوصف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 font-arabic"
                />
              </div>
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="font-arabic">
                <SelectValue placeholder="جميع الأنواع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {caseTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="font-arabic">
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {statusTypes.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium font-arabic text-muted-foreground">إجمالي القضايا</p>
                <p className="text-2xl font-bold">{cases.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Gavel className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium font-arabic text-muted-foreground">مكتملة</p>
                <p className="text-2xl font-bold">{cases.filter(c => c.status === 'مكتملة').length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium font-arabic text-muted-foreground">جارية</p>
                <p className="text-2xl font-bold">{cases.filter(c => c.status === 'جارية').length}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium font-arabic text-muted-foreground">مميزة</p>
                <p className="text-2xl font-bold">{cases.filter(c => c.featured).length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-arabic">القضايا ({cases.length})</CardTitle>
              <CardDescription className="font-arabic">
                قائمة بجميع القضايا المسجلة في النظام
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center font-arabic">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">جارٍ تحميل القضايا...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-12 font-arabic text-muted-foreground">
              <Gavel className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg">لا توجد قضايا</p>
              <p className="text-sm mt-2">
                {searchQuery || selectedType !== "all" || selectedStatus !== "all" 
                  ? "جرب تعديل عوامل التصفية"
                  : "ابدأ بإضافة أول قضية"
                }
              </p>
              <Link href="/admin/cases/new">
                <Button className="mt-4 font-arabic">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة قضية جديدة
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-arabic">القضية</TableHead>
                    <TableHead className="font-arabic">النوع</TableHead>
                    <TableHead className="font-arabic">العميل</TableHead>
                    <TableHead className="font-arabic">السنة</TableHead>
                    <TableHead className="font-arabic">الحالة</TableHead>
                    <TableHead className="font-arabic text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.map((caseItem) => {
                    const TypeIcon = getTypeIcon(caseItem.type)
                    const statusBadge = getStatusBadge(caseItem.status)
                    
                    return (
                      <TableRow key={caseItem._id}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <TypeIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {caseItem.featured && (
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                )}
                                <div className="font-medium font-arabic">{caseItem.title}</div>
                              </div>
                              <div className="text-sm text-muted-foreground font-arabic line-clamp-2">
                                {caseItem.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-arabic">
                            {caseItem.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-arabic">{caseItem.client}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-arabic">{caseItem.year}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`font-arabic ${statusBadge.color}`}>
                            {caseItem.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button
                              variant={caseItem.featured ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleFeatured(caseItem._id)}
                              className="h-8"
                            >
                              <Star className={`w-3 h-3 ml-1 ${caseItem.featured ? 'fill-current' : ''}`} />
                            </Button>
                            
                            <Link href={`/admin/cases/edit?id=${caseItem._id}`}>
                              <Button variant="outline" size="sm" className="h-8">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </Link>

                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                setSelectedCase(caseItem)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="font-arabic">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف قضية "{selectedCase?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedCase && handleDelete(selectedCase._id)}
            >
              <Trash2 className="w-4 h-4 ml-2" />
              حذف القضية
            </Button>
          </DialogFooter>
        </DialogContent>  
      </Dialog>
    </div>
  )
}