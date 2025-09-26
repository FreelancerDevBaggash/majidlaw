"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "./icons"
import { TypingText } from "@/components/typing-text"
import { AnimatedCounter } from "@/components/animated-counter"

export function HeroSection() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  if (isMobile === undefined) {
    return (
      <section
        id="home"
        className="flex items-center justify-center relative overflow-hidden pt-8 sm:pt-12 md:pt-16 pb-8 px-4 min-h-screen"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="home"
      className="flex items-center justify-center relative overflow-hidden pt-8 sm:pt-12 md:pt-16 pb-8 px-4"
    >
      {/* Background decorative elements - hidden on mobile for better performance */}
      <div className="absolute inset-0 opacity-5 hidden md:block">
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-primary rounded-full floating-animation" />
        <div
          className="absolute bottom-20 left-20 w-24 h-24 border-2 border-accent rounded-full floating-animation"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-muted-foreground rounded-full floating-animation"
          style={{ animationDelay: "4s" }}
        />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 opacity-20">
          <div className="w-full h-full text-primary floating-animation" style={{ animationDelay: "1s" }}>
            <Icons.Scale />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-4 sm:space-y-6 slide-in-right order-2 lg:order-1 text-center lg:text-right">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-foreground leading-tight px-2">
                <TypingText
                  text={isMobile ? "مرحباً بكم في مكتب\nالمحامي ماجد المصعبي" : "مرحباً بكم في مكتب المحامي ماجد المصعبي"}
                  speed={isMobile ? 60 : 80}
                  className="block text-balance whitespace-pre-line"
                />
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto lg:mx-0 px-2">
                خبرة أكثر من 20 عامًا في المحاماة والاستشارات القانونية
                <br className="hidden sm:block" />
                <span className="sm:hidden"> - </span>
                متخصص في القانون المدني والتجاري
              </p>

              <div className="flex items-center gap-3 p-3 sm:p-4 bg-accent/10 rounded-lg border border-accent/20 max-w-xs sm:max-w-sm mx-auto lg:mx-0">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 text-accent">
                    <Icons.Phone />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">للاستشارات والمواعيد</p>
                  <a
                    href="tel:+967777395127"
                    className="text-sm sm:text-base font-semibold text-accent hover:text-accent/80 transition-colors block truncate"
                  >
                   777 395 127
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-sm mx-auto lg:max-w-none">
              <div className="text-center p-2 sm:p-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-full mb-2 mx-auto glow-effect">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 text-accent">
                    <Icons.Shield />
                  </div>
                </div>
                <div className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <div className="text-xs text-muted-foreground">قضية ناجحة</div>
              </div>
              <div className="text-center p-2 sm:p-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-full mb-2 mx-auto glow-effect">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 text-accent">
                    <Icons.Award />
                  </div>
                </div>
                <div className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                  <AnimatedCounter end={20} suffix="+" />
                </div>
                <div className="text-xs text-muted-foreground">سنة خبرة</div>
              </div>
              <div className="text-center p-2 sm:p-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-full mb-2 mx-auto glow-effect">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 text-accent">
                    <Icons.Users />
                  </div>
                </div>
                <div className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                  <AnimatedCounter end={95} suffix="%" />
                </div>
                <div className="text-xs text-muted-foreground">نسبة النجاح</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-w-sm mx-auto lg:max-w-none px-2">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground glow-effect h-11 sm:h-12 text-sm px-4 sm:px-6"
              >
                احجز استشارة مجانية
                <div className="w-4 h-4 mr-2">
                  <Icons.ArrowLeft />
                </div>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover:glow-effect bg-transparent h-11 sm:h-12 text-sm px-4 sm:px-6"
              >
                تعرف على خدماتنا
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative slide-in-left order-1 lg:order-2">
            <div className="relative max-w-xs sm:max-w-sm mx-auto lg:max-w-none">
              <img
                src="/brand-logo.jpg"
                alt="شعار المحامي ماجد المصعبي - Brand Online"
                className="w-full h-auto rounded-2xl shadow-2xl bg-black/5 p-4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl" />
            </div>

            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 glass-morphism p-2 sm:p-3 rounded-xl shadow-lg backdrop-blur-md">
              <div className="text-xs text-muted-foreground mb-1">متاح للاستشارة</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium text-sm">الآن</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
