import mongoose, { type Document, Schema } from "mongoose"

export interface IBlogPost extends Document {
  
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  slug: string
  image: string
  published: boolean
  readTime: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    readTime: {
      type: Number,
      required: true,
      min: 1,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Create index for search
BlogPostSchema.index({ title: "text", content: "text", excerpt: "text" })
BlogPostSchema.index({ slug: 1 })
BlogPostSchema.index({ published: 1, createdAt: -1 })

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema)
