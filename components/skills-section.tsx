"use client"

import { useEffect, useState, useRef } from "react"
import { AnimatedCounter } from "@/components/animated-counter"
import { ChevronLeft, ChevronRight, Mail, Phone, Star, Award, Clock } from "lucide-react"

interface TeamMember {
  _id: string
  name: string
  position: string
  bio: string
  image?: string
  email?: string
  phone?: string
  specialization?: string[]
  experience?: string
  education?: string[]
  languages?: string[]
  featured?: boolean
  active?: boolean
}

export function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const skills = [
    { name: "القضايا المدنية", percentage: 95 },
    { name: "القانون التجاري", percentage: 90 },
    { name: "صياغة العقود", percentage: 98 },
    { name: "التحكيم", percentage: 85 },
    { name: "الاستشارات القانونية", percentage: 92 },
  ]

  // دالة لجلب أعضاء الفريق من API
  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/team')
      
      if (!res.ok) {
        throw new Error('فشل في جلب بيانات الفريق')
      }
      
      const data = await res.json()
      const activeMembers = data.teamMembers?.filter((member: TeamMember) => 
        member.active
      ) || []
      
      setTeamMembers(activeMembers)
    } catch (err) {
      console.error('Error fetching team members:', err)
      setError('حدث خطأ في تحميل بيانات الفريق')
    } finally {
      setLoading(false)
    }
  }

  // دوال التحكم في السحب والتمرير
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0))
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0))
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 400
      const gap = 32
      scrollContainerRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: 'smooth'
      })
    }
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % teamMembers.length
    scrollToIndex(nextIndex)
  }

  const prevSlide = () => {
    const prevIndex = currentIndex === 0 ? teamMembers.length - 1 : currentIndex - 1
    scrollToIndex(prevIndex)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    const element = document.getElementById("skills-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  return (
    <section id="about" className="py-20 relative">
      <div className="absolute top-10 right-10 text-8xl font-bold text-primary/10 select-none floating-animation">ن</div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6 text-balance">نبذة عن المحامي ماجد المصعبي</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-pretty">
                  حاصل على ليسانس شريعة وقانون من جامعة صنعاء عام 2000 بتقدير جيد مرتفع. محامي مترافع أمام المحكمة
                  العليا مع خبرة تزيد عن 20 عامًا في المجال القانوني.
                </p>
                <p className="text-pretty">
                  أعمل كمستشار قانوني لعدة شركات تجارية وشركات صرافة، وأتخصص في إعداد ومراجعة العقود القانونية
                  والاتفاقيات التجارية، بالإضافة إلى تقديم الاستشارات القانونية للشركات والأفراد في القضايا المدنية
                  والتجارية.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="glass-morphism p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">تاريخ الميلاد</h4>
                <p className="text-muted-foreground">8 يناير 1977</p>
              </div>
              <div className="glass-morphism p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">مكان الميلاد</h4>
                <p className="text-muted-foreground">محافظة ريمة، مديرية الجبين</p>
              </div>
              <div className="glass-morphism p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">الحالة الاجتماعية</h4>
                <p className="text-muted-foreground">متزوج وله خمسة أبناء</p>
              </div>
              <div className="glass-morphism p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">اللغات</h4>
                <p className="text-muted-foreground">العربية، الإنجليزية</p>
              </div>
            </div>
          </div>

          <div id="skills-section" className="space-y-8">
            <h3 className="text-2xl font-bold text-foreground mb-8">مجالات التخصص والخبرة</h3>

            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground group-hover:text-accent transition-colors duration-300">
                      {skill.name}
                    </span>
                    <span className="text-accent font-bold">
                      {isVisible ? <AnimatedCounter end={skill.percentage} suffix="%" duration={1500} /> : "0%"}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-accent to-accent/80 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{
                        width: isVisible ? `${skill.percentage}%` : "0%",
                        transitionDelay: `${index * 0.2}s`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* قسم فريق العمل المطور */}
        <div className="mt-20 pt-10 border-t">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold text-foreground mb-4">فريق العمل المحترف</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نخبة من المحامين والمستشارين القانونيين المتخصصين لتقديم أفضل الخدمات القانونية
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{error}</p>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="relative">
              {/* أزرار التنقل */}
              {teamMembers.length > 3 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-3 rounded-full shadow-lg border transition-all duration-300 hover:scale-110 hidden lg:flex items-center justify-center"
                  >
                    <ChevronLeft className="w-6 h-6 text-foreground" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-3 rounded-full shadow-lg border transition-all duration-300 hover:scale-110 hidden lg:flex items-center justify-center"
                  >
                    <ChevronRight className="w-6 h-6 text-foreground" />
                  </button>
                </>
              )}

              {/* حاوية التمرير الأفقي */}
              <div
                ref={scrollContainerRef}
                className="flex gap-8 overflow-x-auto scrollbar-hide py-4 px-2 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {teamMembers.map((member, index) => (
                  <div
                    key={member._id}
                    className="flex-none w-80 lg:w-96 transform transition-all duration-500 hover:scale-105"
                  >
                    <div className="glass-morphism rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-border/50">
                      {/* صورة العضو */}
                      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-2xl font-bold">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* علامة العضو المميز */}
                        {member.featured && (
                          <div className="absolute top-4 right-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        )}
                        
                        {/* تأثير hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <div className="flex gap-2">
                            {member.email && (
                              <a 
                                href={`mailto:${member.email}`}
                                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                              >
                                <Mail className="w-4 h-4 text-white" />
                              </a>
                            )}
                            {member.phone && (
                              <a 
                                href={`tel:${member.phone}`}
                                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                              >
                                <Phone className="w-4 h-4 text-white" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* محتوى البطاقة */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="font-bold text-xl text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                            {member.name}
                          </h3>
                          <p className="text-accent font-medium flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            {member.position}
                          </p>
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
                          {member.bio}
                        </p>

                        {/* التخصصات */}
                        {member.specialization && member.specialization.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {member.specialization.slice(0, 3).map((spec, index) => (
                                <span 
                                  key={index} 
                                  className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
                                >
                                  {spec}
                                </span>
                              ))}
                              {member.specialization.length > 3 && (
                                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                  +{member.specialization.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* الخبرة واللغات */}
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          {member.experience && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{member.experience}</span>
                            </div>
                          )}
                          
                          {member.languages && member.languages.length > 0 && (
                            <div className="text-right">
                              <span>{member.languages.slice(0, 2).join('، ')}</span>
                              {member.languages.length > 2 && <span> +</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* مؤشرات التمرير */}
              {teamMembers.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {teamMembers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-accent w-8' 
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg mb-2">لا يوجد أعضاء في الفريق حالياً</p>
              <p className="text-sm">سيتم إضافة فريق العمل قريباً</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}