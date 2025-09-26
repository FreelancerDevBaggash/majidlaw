// lib/blog-api.ts

export interface BlogPost {
  _id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: number
  category: string
  slug: string
  image: string
  published: boolean
  tags: string[] // ✅ تمت الإضافة
  createdAt: string
  updatedAt: string
}

export interface BlogCategory {
  name: string
  count: number
  slug: string // ✅ تمت الإضافة
}

export interface BlogResponse {
  posts: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface BlogPostResponse {
  post: BlogPost
  relatedPosts: BlogPost[] // ✅ تمت الإضافة
}

// دالة مساعدة لإنشاء عنوان URL
function createApiUrl(path: string): string {
  if (typeof window !== 'undefined') {
    // في العميل - استخدام عنوان نسبي
    return `/api${path}`
  }
  
  // في الخادم - استخدام عنوان مطلق
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  return `${baseUrl}/api${path}`
}

// جلب المقالات المنشورة مع دعم الوسوم
export async function getBlogPosts(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  category: string = "",
  tags: string[] = [] // ✅ تمت الإضافة
): Promise<BlogResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(category && { category }),
    ...(tags.length > 0 && { tags: tags.join(',') }), // ✅ تمت الإضافة
  })

  const url = createApiUrl(`/blog/posts?${params}`)
  const response = await fetch(url, {
    next: { revalidate: 60 }
  })

  if (!response.ok) {
    throw new Error('فشل في جلب البيانات')
  }

  return response.json()
}

// جلب مقالة واحدة مع المقالات ذات الصلة
export async function getBlogPostBySlug(slug: string): Promise<BlogPostResponse> {
  const url = createApiUrl(`/blog/posts/${slug}`)
  const response = await fetch(url, {
    next: { revalidate: 60 }
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('المقال غير موجود')
    }
    throw new Error('فشل في جلب المقال')
  }

  return response.json()
}

// جلب التصنيفات مع عدد المقالات
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const url = createApiUrl('/blog/categories')
  const response = await fetch(url, {
    next: { revalidate: 3600 }
  })
  
  if (!response.ok) {
    throw new Error('فشل في جلب التصنيفات')
  }

  return response.json()
}

// جلب المقالات الشائعة
export async function getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
  const url = createApiUrl(`/blog/popular?limit=${limit}`)
  const response = await fetch(url, {
    next: { revalidate: 300 } // 5 دقائق
  })

  if (!response.ok) {
    throw new Error('فشل في جلب المقالات الشائعة')
  }

  return response.json()
}

// جلب المقالات حسب الوسوم
export async function getPostsByTag(tag: string, limit: number = 10): Promise<BlogPost[]> {
  const url = createApiUrl(`/blog/tags/${tag}?limit=${limit}`)
  const response = await fetch(url, {
    next: { revalidate: 60 }
  })

  if (!response.ok) {
    throw new Error('فشل في جلب المقالات')
  }

  return response.json()
}

// جلب جميع الوسوم
export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  const url = createApiUrl('/blog/tags')
  const response = await fetch(url, {
    next: { revalidate: 3600 }
  })

  if (!response.ok) {
    throw new Error('فشل في جلب الوسوم')
  }

  return response.json()
}

// البحث في المقالات
export async function searchBlogPosts(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<BlogResponse> {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  })

  const url = createApiUrl(`/blog/search?${params}`)
  const response = await fetch(url, {
    next: { revalidate: 60 }
  })

  if (!response.ok) {
    throw new Error('فشل في البحث')
  }

  return response.json()
}

// جلب المقالات المقترحة بناءً على المقال الحالي
export async function getSuggestedPosts(
  currentPostId: string,
  category: string,
  tags: string[],
  limit: number = 3
): Promise<BlogPost[]> {
  const params = new URLSearchParams({
    exclude: currentPostId,
    category,
    tags: tags.slice(0, 3).join(','),
    limit: limit.toString(),
  })

  const url = createApiUrl(`/blog/suggested?${params}`)
  const response = await fetch(url, {
    next: { revalidate: 60 }
  })

  if (!response.ok) {
    throw new Error('فشل في جلب المقالات المقترحة')
  }

  return response.json()
}

// وظائف مساعدة للتواريخ
export function formatDateArabic(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'منذ يوم'
  if (diffDays < 7) return `منذ ${diffDays} أيام`
  if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`
  if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} أشهر`
  return `منذ ${Math.floor(diffDays / 365)} سنوات`
}

// وظائف للتحقق من صحة البيانات
export function validateBlogPost(post: Partial<BlogPost>): boolean {
  const requiredFields = [
    'title',
    'excerpt',
    'content',
    'author',
    'category',
    'slug'
  ]

  return requiredFields.every(field => 
    post[field as keyof BlogPost] && 
    String(post[field as keyof BlogPost]).trim().length > 0
  )
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// أنواع للتصفية والترتيب
export interface BlogFilters {
  category?: string
  tags?: string[]
  published?: boolean
  author?: string
  dateFrom?: string
  dateTo?: string
}

export interface BlogSortOptions {
  field: 'createdAt' | 'updatedAt' | 'title' | 'readTime'
  order: 'asc' | 'desc'
}

// تصدير أنواع إضافية للاستخدام في المكونات
export type { BlogPost as IBlogPost }
export type { BlogCategory as IBlogCategory }

// كائن افتراضي للمقال
export const defaultBlogPost: Partial<BlogPost> = {
  title: '',
  excerpt: '',
  content: '',
  author: 'فريق المكتب القانوني',
  date: new Date().toISOString(),
  readTime: 1,
  category: '',
  slug: '',
  image: '',
  published: false,
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}