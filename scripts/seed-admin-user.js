// Script to create initial admin user
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lawyer-website"

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
  },
  { timestamps: true },
)

const User = mongoose.models.User || mongoose.model("User", UserSchema)

async function seedAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: "admin" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash("admin123", salt)

    // Create admin user
    const adminUser = new User({
      username: "admin",
      email: "admin@lawyersite.com",
      password: hashedPassword,
      role: "admin",
    })

    await adminUser.save()
    console.log("Admin user created successfully!")
    console.log("Username: admin")
    console.log("Password: admin123")
    console.log("Please change the password after first login")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await mongoose.disconnect()
  }
}

seedAdminUser()
