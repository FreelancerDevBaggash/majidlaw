// components/cases-timeline.tsx (محدث)
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "./icons"

interface Case {
  _id: string
  title: string
  description: string
  year: string
  type: string
  result: string
  status: string
  featured?: boolean
}

export function CasesTimeline() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/admin/cases?featured=true&limit=4')
        if (res.ok) {
          const data = await res.json()
          setCases(data.cases || [])
        }
      } catch (error) {
        console.error('Error fetching cases:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

  const getIcon = (type: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      'تجاري': Icons.Building,
      'مدني': Icons.Users,
      'تحكيم': Icons.Trophy,
      'جنائي': Icons.Gavel,
      'أسرة': Icons.Users,
      'عمل': Icons.Briefcase
    }
    return icons[type] || Icons.Building
  }

  if (loading) {
    return (
      <section id="cases" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    )
  }

  return (
    <section id="cases" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">قضايا بارزة ونجاحات مميزة</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            مجموعة من أهم القضايا التي تم التعامل معها بنجاح على مدار السنوات الماضية
          </p>
        </div>

        <div className="relative">
          <div className="absolute right-1/2 transform translate-x-1/2 w-1 h-full bg-accent/20 hidden lg:block" />

          <div className="space-y-12">
            {cases.map((case_, index) => {
              const CaseIcon = getIcon(case_.type)
              return (
                <div key={case_._id} className={`flex items-center gap-8 ${index % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                  <div className="hidden lg:flex items-center justify-center w-16 h-16 bg-accent rounded-full border-4 border-background shadow-lg flex-shrink-0">
                    <div className="w-8 h-8 text-accent-foreground">
                      <CaseIcon />
                    </div>
                  </div>

                  <Card className="flex-1 glass-morphism border-0 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-accent font-bold text-lg">
                          <div className="w-5 h-5">
                            <Icons.Calendar />
                          </div>
                          {case_.year}
                        </div>
                        <Badge variant="secondary">{case_.type}</Badge>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {case_.status}
                        </Badge>
                      </div>

                      <h3 className="text-2xl font-bold text-foreground mb-3">{case_.title}</h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{case_.description}</p>

                      <div className="bg-accent/10 rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2">النتيجة:</h4>
                        <p className="text-accent font-medium">{case_.result}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="hidden lg:block flex-1" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}