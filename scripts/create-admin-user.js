import connectDB from "../lib/mongodb.js"
import User from "../models/User.js"

async function createAdminUser() {
  try {
    await connectDB()

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: "admin" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const adminUser = new User({
      username: "admin",
      email: "admin@lawyermajed.com",
      password: "admin123", // This will be hashed automatically
      role: "admin",
    })

    await adminUser.save()
    console.log("Admin user created successfully!")
    console.log("Username: admin")
    console.log("Password: admin123")
    console.log("Please change the password after first login")
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

createAdminUser()
