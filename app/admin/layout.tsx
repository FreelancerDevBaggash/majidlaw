import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "لوحة التحكم الإدارية - المحامي ماجد المصعبي",
  description: "لوحة التحكم الإدارية لإدارة المدونة القانونية",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
