import { Icons } from "./icons"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8">
                <Icons.Scale />
              </div>
              <span className="text-2xl font-bold">المحامي ماجد المصعبي</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed mb-6">
              مكتب محاماة متخصص في القانون المدني والتجاري مع خبرة تزيد عن 20 عامًا في تقديم الخدمات القانونية المتميزة
              للأفراد والشركات.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4">
                  <Icons.Phone />
                </div>
                <span>+967 1 234 567</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4">
                  <Icons.Mail />
                </div>
                <span>info@majed-lawyer.com</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4">
                  <Icons.MapPin />
                </div>
                <span>صنعاء، اليمن</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">خدماتنا</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>القانون المدني</li>
              <li>القانون التجاري</li>
              <li>صياغة العقود</li>
              <li>الاستشارات القانونية</li>
              <li>التمثيل أمام المحاكم</li>
              <li>التحكيم</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  الخدمات
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  نبذة عن فريقي 
                </a>
              </li>
              <li>
                <a href="#cases" className="hover:text-white transition-colors">
                  القضايا
                </a>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  المدونة القانونية
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60">© 2025 مكتب المحامي ماجد المصعبي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
