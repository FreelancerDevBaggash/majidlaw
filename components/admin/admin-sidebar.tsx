"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { 
  Gavel, 
  Users, 
  Building, 
  Settings,
  FileText,
  User
} from "lucide-react"

const navigation = [
  {
    name: "لوحة التحكم",
    href: "/admin", // Fixed navigation to point to correct admin route
    icon: Icons.Home,
  },
  {
    name: "المقالات",
    href: "/admin/posts",
    icon: Icons.FileText,
  },
  {
    name: "التعليقات",
    href: "/admin/comments",
    icon: Icons.MessageCircle,
  },
   {
    href: "/admin/team",
    name: "فريق العمل",
    icon: Users
  },
  
   {

    href: "/admin/cases",
    name: "إدارة القضايا",
    icon: Gavel
  },
  {
    name: "الإعدادات",
    href: "/admin/settings",
    icon: Icons.Settings,
  },
]

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 right-4 z-50 bg-background border"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-4 w-4">{isOpen ? <Icons.X /> : <Icons.Menu />}</div>
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-64 bg-card border-l border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold font-arabic">إدارة المدونة</h2>
            <p className="text-sm text-muted-foreground font-arabic">لوحة التحكم الرئيسية</p>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href === "/admin" && pathname === "/admin/dashboard")
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start font-arabic h-10",
                      isActive && "bg-primary text-primary-foreground shadow-sm",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="ml-2 h-4 w-4">
                      <item.icon />
                    </div>
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground font-arabic text-center">نظام إدارة المحتوى v1.0</p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
