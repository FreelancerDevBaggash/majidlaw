// "use client"
// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { adminAuth } from "@/lib/admin-auth"

// export function AdminGuard({ children }: { children: React.ReactNode }) {
//   const router = useRouter()

//   useEffect(() => {
//     if (!adminAuth.isAuthenticated()) {
//       router.push("/admin/login")
//     }
//   }, [router])

//   if (!adminAuth.isAuthenticated()) return null

//   return <>{children}</>
// }
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminAuth } from '@/lib/admin-auth'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const session = adminAuth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      setIsAuthenticated(true)
    }

    checkAuth()
  }, [router])

  // عرض loading أثناء التحقق من المصادقة
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground font-arabic">جاري التحقق من الصلاحية...</p>
        </div>
      </div>
    )
  }

  // إذا لم يتم المصادقة، لا نعرض anything (سيتم التوجيه)
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}