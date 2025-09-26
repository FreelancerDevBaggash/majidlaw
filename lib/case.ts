// types/case.ts
export interface CaseType {
  _id: string
  title: string
  description: string
  year: string
  type: string
  result: string
  status: 'مكتملة' | 'جارية' | 'ملغاة'
  client: string
  value?: string
  duration?: string
  tags?: string[]
  featured?: boolean
  image?: string
  createdAt: string
  updatedAt: string
}

export interface CaseResponse {
  cases: CaseType[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}