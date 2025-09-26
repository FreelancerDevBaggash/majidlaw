// types/team.ts
export interface TeamMemberType {
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
  order?: number
  featured?: boolean
  active?: boolean
  createdAt: string
  updatedAt: string
}

export interface TeamResponse {
  teamMembers: TeamMemberType[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}