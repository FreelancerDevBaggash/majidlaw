export interface BlogPost {
  id: string
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
}

export interface BlogCategory {
  name: string
  count: number
  slug: string
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "حقوق المستهلك في القانون السعودي",
    excerpt: "نظرة شاملة على حقوق المستهلك وآليات الحماية المتاحة في النظام السعودي وكيفية الاستفادة منها.",
    content: "محتوى المقال الكامل...",
    author: "فريق المكتب القانوني",
    date: "2024-01-15",
    readTime: 8,
    category: "قانون تجاري",
    slug: "consumer-rights-saudi-law",
    image: "/legal-documents-consumer-rights.jpg",
    published: true,
  },
  {
    id: "2",
    title: "التحكيم التجاري في المملكة العربية السعودية",
    excerpt: "دليل شامل حول نظام التحكيم التجاري وإجراءاته وأهميته في حل النزاعات التجارية.",
    content: "محتوى المقال الكامل...",
    author: "فريق المكتب القانوني",
    date: "2024-01-10",
    readTime: 12,
    category: "تحكيم",
    slug: "commercial-arbitration-saudi",
    image: "/arbitration-legal-meeting.jpg",
    published: true,
  },
  {
    id: "3",
    title: "عقود العمل والتزامات صاحب العمل",
    excerpt: "تفصيل شامل لحقوق والتزامات أطراف عقد العمل وفقاً لنظام العمل السعودي الجديد.",
    content: "محتوى المقال الكامل...",
    author: "فريق المكتب القانوني",
    date: "2024-01-05",
    readTime: 10,
    category: "قانون عمل",
    slug: "employment-contracts-obligations",
    image: "/employment-contract-signing.jpg",
    published: true,
  },
  {
    id: "4",
    title: "الملكية الفكرية وحماية العلامات التجارية",
    excerpt: "أهمية حماية الملكية الفكرية والعلامات التجارية وإجراءات التسجيل والحماية القانونية.",
    content: "محتوى المقال الكامل...",
    author: "فريق المكتب القانوني",
    date: "2023-12-28",
    readTime: 15,
    category: "ملكية فكرية",
    slug: "intellectual-property-trademarks",
    image: "/intellectual-property-trademark.jpg",
    published: true,
  },
  {
    id: "5",
    title: "النزاعات العقارية وطرق حلها",
    excerpt: "استعراض أنواع النزاعات العقارية الشائعة والطرق القانونية المتاحة لحلها بفعالية.",
    content: "محتوى المقال الكامل...",
    author: "فريق المكتب القانوني",
    date: "2023-12-20",
    readTime: 9,
    category: "قانون عقاري",
    slug: "real-estate-disputes-solutions",
    image: "/real-estate-legal-documents.jpg",
    published: true,
  },
  {
    id: "6",
    title: "الشركات الناشئة والإطار القانوني",
    excerpt: "دليل قانوني للشركات الناشئة يغطي التأسيس والتمويل والامتثال القانوني.",
    content: "محتوى المقال الكامل...",
    author: "فريق المكتب القانوني",
    date: "2023-12-15",
    readTime: 11,
    category: "قانون شركات",
    slug: "startups-legal-framework",
    image: "/startup-legal-meeting.jpg",
    published: true,
  },
]

export const blogCategories: BlogCategory[] = [
  { name: "قانون تجاري", count: 8, slug: "commercial-law" },
  { name: "قانون عمل", count: 5, slug: "labor-law" },
  { name: "تحكيم", count: 4, slug: "arbitration" },
  { name: "ملكية فكرية", count: 3, slug: "intellectual-property" },
  { name: "قانون عقاري", count: 6, slug: "real-estate-law" },
  { name: "قانون شركات", count: 7, slug: "corporate-law" },
]
