import { Button } from "@/components/ui/button"
import Link from "next/link"

export function BlogHeader() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-arabic mb-6 text-balance">مدونة المكتب القانوني</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 text-pretty leading-relaxed">
            مقالات قانونية متخصصة وتحليلات قضائية من فريق المكتب القانوني
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="secondary" size="lg" className="font-arabic">
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
