// import { clsx, type ClassValue } from 'clsx'
// import { twMerge } from 'tailwind-merge'

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeInput(input: string): string {
  if (!input) return ''
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function generateSlug(title: string): string {
  if (!title) return ''
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// دالة للتعامل مع القيم المحتملة أن تكون null أو undefined
export function safeAccess<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const value = path.split('.').reduce((acc, key) => acc?.[key], obj)
    return value !== undefined && value !== null ? value : defaultValue
  } catch {
    return defaultValue
  }
}