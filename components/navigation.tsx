"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "./icons"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    setIsDarkMode(document.documentElement.classList.contains("dark"))

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    if (typeof document === "undefined") return

    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const navItems = [
    { href: "#home", label: "الرئيسية" },
    { href: "#services", label: "الخدمات" },
    { href: "#about", label: "نبذة عن فريقي" },
    { href: "#cases", label: "القضايا" },
    { href: "/blog", label: "المدونة القانونية", isLink: true },
    { href: "#contact", label: "اتصل بنا" },
  ]

  if (isDarkMode === undefined) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism shadow-lg backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg sm:text-xl">
              <div className="w-5 h-5 sm:w-6 sm:h-6">
                <Icons.Scale />
              </div>
              <span className="truncate">المحامي ماجد المصعبي</span>
            </Link>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "glass-morphism shadow-lg backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg sm:text-xl group">
            <div className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300">
              <Icons.Scale />
            </div>
            <span className="group-hover:text-accent transition-colors duration-300 truncate">
              المحامي ماجد المصعبي
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) =>
              item.isLink ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-accent transition-all duration-300 font-medium relative group text-sm lg:text-base"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-accent transition-all duration-300 font-medium relative group text-sm lg:text-base"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </a>
              ),
            )}
          </div>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hover:glow-effect">
              <div className="w-4 h-4 lg:w-5 lg:h-5">{isDarkMode ? <Icons.Sun /> : <Icons.Moon />}</div>
            </Button>
            <Link href="/admin/login">
              <Button variant="outline" size="sm" className="text-xs lg:text-sm px-2 lg:px-3 bg-transparent">
                <div className="w-3 h-3 lg:w-4 lg:h-4 ml-1">
                  <Icons.Settings />
                </div>
                لوحة التحكم
              </Button>
            </Link>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground glow-effect text-sm lg:text-base px-3 lg:px-4">
              <div className="w-4 h-4 ml-2">
                <Icons.Phone />
              </div>
              استشارة مجانية
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden transition-transform duration-300 hover:scale-110 w-10 h-10 sm:w-12 sm:h-12"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <div
                className={cn(
                  "w-6 h-6 absolute transition-all duration-300",
                  isMobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
                )}
              >
                <Icons.Menu />
              </div>
              <div
                className={cn(
                  "w-6 h-6 absolute transition-all duration-300",
                  isMobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
                )}
              >
                <Icons.X />
              </div>
            </div>
          </Button>
        </div>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-500 ease-in-out",
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="glass-morphism mt-2 rounded-lg p-4 sm:p-6 space-y-3 backdrop-blur-md">
            {navItems.map((item, index) =>
              item.isLink ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-foreground hover:text-accent transition-all duration-300 font-medium py-3 px-2 hover:translate-x-2 text-base sm:text-lg rounded-lg hover:bg-accent/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-foreground hover:text-accent transition-all duration-300 font-medium py-3 px-2 hover:translate-x-2 text-base sm:text-lg rounded-lg hover:bg-accent/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                </a>
              ),
            )}
            <div className="flex items-center gap-3 pt-4 border-t border-border/20">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hover:glow-effect w-12 h-12">
                <div className="w-5 h-5">{isDarkMode ? <Icons.Sun /> : <Icons.Moon />}</div>
              </Button>
              <Link href="/admin/login">
                <Button variant="outline" size="sm" className="text-sm px-3 bg-transparent">
                  <div className="w-4 h-4 ml-1">
                    <Icons.Settings />
                  </div>
                  لوحة التحكم
                </Button>
              </Link>
              <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground glow-effect h-12 text-base">
                <div className="w-4 h-4 ml-2">
                  <Icons.Phone />
                </div>
                استشارة مجانية
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
