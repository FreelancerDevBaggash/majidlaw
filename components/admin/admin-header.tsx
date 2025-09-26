"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useRouter, usePathname } from "next/navigation"
import { adminAuth } from "@/lib/admin-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  Menu,
  Home,
  Shield,
  Mail,
  Phone,
  Moon,
  Sun,
  Search,
  X
} from "lucide-react"

interface Session {
  username: string
  role: string
  email?: string
  avatar?: string
  lastLogin?: string
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'info' | 'warning' | 'success' | 'error'
}

export function AdminHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<Session | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // عناوين الصفحات
  const pageTitles: { [key: string]: string } = {
    "/admin": "لوحة التحكم الرئيسية",
    "/admin/posts": "إدارة المقالات",
    "/admin/cases": "إدارة القضايا", 
    "/admin/team": "إدارة فريق العمل",
    "/admin/clients": "إدارة العملاء",
    "/admin/settings": "الإعدادات العامة",
    "/admin/analytics": "التقارير والإحصائيات"
  }

  // الحصول على عنوان الصفحة الحالية
  const getCurrentPageTitle = () => {
    for (const [path, title] of Object.entries(pageTitles)) {
      if (pathname.startsWith(path)) {
        return title
      }
    }
    return "لوحة التحكم"
  }

  useEffect(() => {
    const currentSession = adminAuth.getSession()
    setSession(currentSession)

    // تحميل الإشعارات (بيانات تجريبية)
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        title: "طلب استشارة جديد",
        message: "تم استلام طلب استشارة قانونية جديدة من عميل",
        time: "منذ 5 دقائق",
        read: false,
        type: 'info'
      },
      {
        id: "2", 
        title: "تحديث النظام",
        message: "تم تحديث النظام إلى الإصدار 2.1.0",
        time: "منذ ساعة",
        read: false,
        type: 'success'
      },
      {
        id: "3",
        title: "تنبيه الأمان",
        message: "تم اكتشاف محاولة دخول غير مصرحة",
        time: "منذ 3 ساعات",
        read: true,
        type: 'warning'
      }
    ]
    
    setNotifications(sampleNotifications)
    setUnreadCount(sampleNotifications.filter(n => !n.read).length)
  }, [])

  const handleLogout = () => {
    adminAuth.logout()
    router.push("/admin/login")
  }

  const handleNotificationRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })))
    setUnreadCount(0)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'editor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'viewer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير النظام'
      case 'editor': return 'محرر'
      case 'viewer': return 'مشاهد'
      default: return 'مستخدم'
    }
  }

  const getNotificationIconColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-500'
      case 'warning': return 'bg-yellow-500'
      case 'success': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* الجانب الأيسر - العنوان والقائمة الجوال */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* زر القائمة للجوال */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            {/* عنوان الصفحة */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-arabic text-foreground leading-tight">
                  {getCurrentPageTitle()}
                </h1>
                <p className="text-xs text-muted-foreground font-arabic hidden sm:block mt-1">
                  نظام إدارة المكتب القانوني المتكامل
                </p>
              </div>
            </div>
          </div>

          {/* الجانب الأيمن - أدوات المستخدم */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {/* شريط البحث (للشاشات المتوسطة فما فوق) */}
            {isSearchOpen ? (
              <div className="absolute top-0 left-0 right-0 bg-card border-b p-3 lg:relative lg:top-auto lg:left-auto lg:right-auto lg:border-0 lg:p-0 lg:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث في النظام..."
                  className="bg-transparent border-none outline-none text-sm w-full lg:w-40 xl:w-60 font-arabic"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-6 w-6"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <>
                {/* زر البحث للجوال */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden h-9 w-9"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="w-4 h-4" />
                </Button>

                {/* شريط البحث للشاشات الكبيرة */}
                <div className="hidden lg:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-muted/70">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="بحث..."
                    className="bg-transparent border-none outline-none text-sm w-40 xl:w-60 font-arabic placeholder:text-muted-foreground"
                  />
                </div>
              </>
            )}

            {/* زر الوضع الداكن */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={toggleDarkMode}
              title={isDarkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* الإشعارات */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center min-w-[20px]"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 sm:w-96 font-arabic border shadow-lg">
                <div className="flex items-center justify-between p-4 border-b bg-muted/50">
                  <h3 className="font-semibold text-sm">الإشعارات</h3>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead} 
                      className="text-xs h-7 px-2"
                    >
                      تعيين الكل كمقروء
                    </Button>
                  )}
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`flex flex-col items-start p-3 cursor-pointer border-b last:border-b-0 transition-colors hover:bg-muted/30 ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => handleNotificationRead(notification.id)}
                      >
                        <div className="flex items-start justify-between w-full gap-2">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getNotificationIconColor(notification.type)}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm truncate">{notification.title}</span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{notification.message}</p>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">لا توجد إشعارات جديدة</p>
                    </div>
                  )}
                </div>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary font-medium text-sm py-3 hover:bg-muted/30">
                  عرض جميع الإشعارات
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ملف المستخدم */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1 sm:p-2 h-9 sm:h-10">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium font-arabic leading-none">
                      {session?.username || "ضيف"}
                    </span>
                    {session?.role && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs mt-1 ${getRoleBadgeColor(session.role)}`}
                      >
                        {getRoleLabel(session.role)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                    {session?.avatar ? (
                      <img 
                        src={session.avatar} 
                        alt={session.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 font-arabic border shadow-lg">
                {/* معلومات المستخدم */}
                <div className="flex items-center gap-3 p-4 border-b bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                    {session?.avatar ? (
                      <img 
                        src={session.avatar} 
                        alt={session.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{session?.username || "ضيف"}</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">{session?.email || "لا يوجد بريد"}</p>
                    {session?.role && (
                      <Badge variant="outline" className="text-xs mt-2">
                        {getRoleLabel(session.role)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-1">
                  <DropdownMenuItem 
                    onClick={() => router.push("/admin")}
                    className="text-sm px-3 py-2 rounded-md"
                  >
                    <Home className="w-4 h-4 ml-2" />
                    لوحة التحكم
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    onClick={() => router.push("/admin/profile")}
                    className="text-sm px-3 py-2 rounded-md"
                  >
                    <User className="w-4 h-4 ml-2" />
                    الملف الشخصي
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    onClick={() => router.push("/admin/settings")}
                    className="text-sm px-3 py-2 rounded-md"
                  >
                    <Settings className="w-4 h-4 ml-2" />
                    الإعدادات
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                    آخر دخول: {session?.lastLogin || "غير معروف"}
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive justify-center font-medium text-sm px-3 py-2 rounded-md"
                  >
                    <LogOut className="w-4 h-4 ml-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* القائمة الجوال */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-muted/50 rounded-lg border animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="ghost" 
                className="justify-start font-arabic h-11 text-sm"
                onClick={() => {
                  router.push("/admin/posts")
                  setIsMobileMenuOpen(false)
                }}
              >
                📝 المقالات
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start font-arabic h-11 text-sm"
                onClick={() => {
                  router.push("/admin/cases")
                  setIsMobileMenuOpen(false)
                }}
              >
                ⚖️ القضايا
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start font-arabic h-11 text-sm"
                onClick={() => {
                  router.push("/admin/team")
                  setIsMobileMenuOpen(false)
                }}
              >
                👥 الفريق
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start font-arabic h-11 text-sm"
                onClick={() => {
                  router.push("/admin/clients")
                  setIsMobileMenuOpen(false)
                }}
              >
                🤝 العملاء
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}