import mongoose, { type Document, Schema } from "mongoose"

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId
  name: string
  email: string
  content: string
  approved: boolean
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

CommentSchema.index({ postId: 1, approved: 1, createdAt: -1 })

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema)
