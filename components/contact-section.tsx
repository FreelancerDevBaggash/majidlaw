"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "./icons"
import { FloatingLabelInput } from "@/components/floating-label-input"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Form submitted:", formData)
    setIsSubmitting(false)
    setSubmitSuccess(true)

    // Reset form after success
    setTimeout(() => {
      setSubmitSuccess(false)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: Icons.Phone,
      title: "الهاتف",
      details: ["+967 777 395 127", "متاح 24/7 للطوارئ"],
      action: "اتصل الآن",
      link: "tel:+967777395127",
    },
    {
      icon: Icons.Mail,
      title: "البريد الإلكتروني",
      details: ["maged1804@gmail.com", "للاستشارات القانونية"],
      action: "أرسل رسالة",
    },
    {
      icon: Icons.MapPin,
      title: "العنوان",
      details: ["صنعاء، اليمن", "شارع الزبيري، مجمع الأعمال"],
      action: "عرض الخريطة",
      link: "https://maps.app.goo.gl/roWf7VJzd9nEjh9j6",
    },
    {
      icon: Icons.Clock,
      title: "ساعات العمل",
      details: ["السبت - الخميس: 8:00 - 17:00", "الجمعة: مغلق"],
      action: "احجز موعد",
    },
  ]

  return (
    <section id="contact" className="py-20 relative">
      <div className="absolute top-10 right-10 text-8xl font-bold text-primary/10 select-none floating-animation">
        ت
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">تواصل معنا</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            نحن هنا لمساعدتك في جميع احتياجاتك القانونية. تواصل معنا للحصول على استشارة مجانية
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">معلومات التواصل</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-pretty">
                يمكنك التواصل معنا من خلال أي من الطرق التالية، وسنكون سعداء لمساعدتك في حل مشاكلك القانونية بأفضل الطرق
                الممكنة.
              </p>
            </div>

            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="glass-morphism border-0 hover:shadow-lg transition-all duration-300 card-3d"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full flex-shrink-0 glow-effect">
                        <div className="w-6 h-6 text-accent">
                          <info.icon />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">{info.title}</h4>
                        <div className="space-y-1 mb-3">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground">
                              {detail}
                            </p>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-accent hover:text-accent/80 p-0 hover:glow-effect"
                          onClick={() => {
                            if (info.link) {
                              window.open(info.link, "_blank")
                            } else if (info.title === "البريد الإلكتروني") {
                              window.open(`mailto:${info.details[0]}`, "_blank")
                            }
                          }}
                        >
                          {info.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-all duration-300 card-3d dark:bg-green-900/20 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full dark:bg-green-800/50">
                    <div className="w-6 h-6 text-green-600 dark:text-green-400">
                      <Icons.MessageSquare />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-1 dark:text-green-300">واتساب</h4>
                    <p className="text-green-600 text-sm mb-3 dark:text-green-400">
                      تواصل معنا مباشرة عبر الواتساب للحصول على رد سريع
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white glow-effect">
                      <div className="w-4 h-4 ml-2">
                        <Icons.MessageSquare />
                      </div>
                      تواصل عبر الواتساب
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-morphism border-0 card-3d">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">أرسل رسالة</h3>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
                  <p className="text-green-800 dark:text-green-300 text-center">
                    تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FloatingLabelInput
                    label="الاسم الكامل *"
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                  />
                  <FloatingLabelInput
                    label="رقم الهاتف *"
                    type="tel"
                    value={formData.phone}
                    onChange={(value) => setFormData({ ...formData, phone: value })}
                  />
                </div>

                <FloatingLabelInput
                  label="البريد الإلكتروني"
                  type="email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                />

                <FloatingLabelInput
                  label="موضوع الاستشارة *"
                  value={formData.subject}
                  onChange={(value) => setFormData({ ...formData, subject: value })}
                />

                <div className="relative">
                  <Textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اشرح تفاصيل مشكلتك القانونية..."
                    className="pt-6 pb-2"
                  />
                  <label className="absolute right-3 top-3 text-muted-foreground pointer-events-none transition-all duration-300">
                    تفاصيل الاستشارة *
                  </label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 glow-effect"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 ml-2">
                        <Icons.Loader2 />
                      </div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 ml-2">
                        <Icons.Send />
                      </div>
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16">
          <Card className="glass-morphism border-0 overflow-hidden">
            <div className="relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.123456789!2d44.2066!3d15.3694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDIyJzA5LjgiTiA0NMKwMTInMjMuOCJF!5e0!3m2!1sar!2s!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="موقع مكتب المحامي ماجد الماسبي"
              />
              <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <h4 className="font-semibold text-foreground">مكتب المحامي ماجد الماسبي</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">صنعاء، اليمن</p>
                <p className="text-sm text-muted-foreground">شارع الزبيري، مجمع الأعمال</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full text-xs bg-transparent"
                  onClick={() => window.open("https://maps.app.goo.gl/roWf7VJzd9nEjh9j6", "_blank")}
                >
                  <div className="w-3 h-3 ml-1">
                    <Icons.MapPin />
                  </div>
                  فتح في خرائط جوجل
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
