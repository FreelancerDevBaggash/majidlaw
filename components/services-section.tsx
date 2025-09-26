"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "./icons"

export function ServicesSection() {
  const services = [
    {
      icon: Icons.Scale,
      title: "القانون المدني",
      description: "تمثيل العملاء في القضايا المدنية والنزاعات الشخصية",
      features: ["قضايا الملكية", "النزاعات العقارية", "التعويضات"],
    },
    {
      icon: Icons.Building,
      title: "القانون التجاري",
      description: "استشارات قانونية شاملة للشركات والأعمال التجارية",
      features: ["تأسيس الشركات", "العقود التجارية", "النزاعات التجارية"],
    },
    {
      icon: Icons.FileText,
      title: "صياغة العقود",
      description: "إعداد ومراجعة العقود والاتفاقيات القانونية",
      features: ["عقود البيع", "عقود الإيجار", "اتفاقيات الشراكة"],
    },
    {
      icon: Icons.Users,
      title: "الاستشارات القانونية",
      description: "تقديم المشورة القانونية للأفراد والشركات",
      features: ["استشارات فورية", "تحليل قانوني", "خطط قانونية"],
    },
    {
      icon: Icons.Gavel,
      title: "التمثيل أمام المحاكم",
      description: "الترافع والدفاع أمام جميع درجات المحاكم",
      features: ["المحكمة الابتدائية", "محكمة الاستئناف", "المحكمة العليا"],
    },
    {
      icon: Icons.Shield,
      title: "التحكيم وحل النزاعات",
      description: "حل النزاعات خارج المحاكم بطرق ودية",
      features: ["التحكيم التجاري", "الوساطة", "التفاوض"],
    },
  ]

  return (
    <section id="services" className="py-20 bg-muted/30 relative">
      <div className="absolute top-10 right-10 text-8xl font-bold text-primary/10 select-none">خ</div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">خدماتنا القانونية</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            نقدم مجموعة شاملة من الخدمات القانونية المتخصصة لضمان حماية حقوقكم
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group card-3d hover:shadow-xl transition-all duration-500 border-0 glass-morphism backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                  <service.icon />
                </div>

                <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6 group-hover:bg-accent/20 transition-all duration-300 glow-effect">
                  <service.icon />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed text-pretty">{service.description}</p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icons.ArrowLeft />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="text-accent font-medium group-hover:text-accent/80 transition-all duration-300 cursor-pointer group-hover:glow-effect">
                  اعرف المزيد ←
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
