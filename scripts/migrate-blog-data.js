// Script to migrate existing blog data to MongoDB
const mongoose = require("mongoose")

const MONGODB_URI = process.env.MONGODB_URI

const BlogPostSchema = new mongoose.Schema(
  {
    title: String,
    excerpt: String,
    content: String,
    author: String,
    category: String,
    slug: { type: String, unique: true },
    image: String,
    published: { type: Boolean, default: true },
    readTime: Number,
    tags: [String],
  },
  { timestamps: true },
)

const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema)

const blogPosts = [
  {
    title: "حقوق المستهلك في القانون السعودي",
    excerpt: "نظرة شاملة على حقوق المستهلك وآليات الحماية المتاحة في النظام السعودي وكيفية الاستفادة منها.",
    content: "محتوى المقال الكامل حول حقوق المستهلك في القانون السعودي...",
    author: "فريق المكتب القانوني",
    category: "قانون تجاري",
    slug: "consumer-rights-saudi-law",
    image: "/legal-documents-consumer-rights.jpg",
    published: true,
    readTime: 8,
    tags: ["حقوق المستهلك", "القانون السعودي", "الحماية القانونية"],
  },
  {
    title: "التحكيم التجاري في المملكة العربية السعودية",
    excerpt: "دليل شامل حول نظام التحكيم التجاري وإجراءاته وأهميته في حل النزاعات التجارية.",
    content: "محتوى المقال الكامل حول التحكيم التجاري...",
    author: "فريق المكتب القانوني",
    category: "تحكيم",
    slug: "commercial-arbitration-saudi",
    image: "/arbitration-legal-meeting.jpg",
    published: true,
    readTime: 12,
    tags: ["التحكيم", "النزاعات التجارية", "القانون التجاري"],
  },
  {
    title: "عقود العمل والتزامات صاحب العمل",
    excerpt: "تفصيل شامل لحقوق والتزامات أطراف عقد العمل وفقاً لنظام العمل السعودي الجديد.",
    content: "محتوى المقال الكامل حول عقود العمل...",
    author: "فريق المكتب القانوني",
    category: "قانون عمل",
    slug: "employment-contracts-obligations",
    image: "/employment-contract-signing.jpg",
    published: true,
    readTime: 10,
    tags: ["عقود العمل", "حقوق العمال", "قانون العمل"],
  },
]

async function migrateBlogData() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing posts
    await BlogPost.deleteMany({})
    console.log("Cleared existing blog posts")

    // Insert new posts
    await BlogPost.insertMany(blogPosts)
    console.log(`Migrated ${blogPosts.length} blog posts successfully!`)
  } catch (error) {
    console.error("Error migrating blog data:", error)
  } finally {
    await mongoose.disconnect()
  }
}

migrateBlogData()
