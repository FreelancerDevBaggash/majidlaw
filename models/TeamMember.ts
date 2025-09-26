// models/TeamMember.ts
import mongoose from 'mongoose'

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  specialization: {
    type: [String],
    required: false
  },
  experience: {
    type: String,
    required: false
  },
  education: {
    type: [String],
    required: false
  },
  languages: {
    type: [String],
    required: false
  },
  order: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema)