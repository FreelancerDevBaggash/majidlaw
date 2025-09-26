// models/Case.ts
import mongoose from 'mongoose'

const CaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['تجاري', 'مدني', 'تحكيم', 'جنائي', 'أسرة', 'عمل']
  },
  result: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['مكتملة', 'جارية', 'ملغاة'],
    default: 'مكتملة'
  },
  client: {
    type: String,
    required: true
  },
  value: {
    type: String, // قيمة القضية مثل "50 مليون ريال"
    required: false
  },
  duration: {
    type: String, // مدة القضية
    required: false
  },
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

export default mongoose.models.Case || mongoose.model('Case', CaseSchema)