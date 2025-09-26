const { MongoClient } = require("mongodb")

async function createAdminUser() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error("MONGODB_URI environment variable is not set")
    return
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const users = db.collection("users")

    // Check if admin user already exists
    const existingAdmin = await users.findOne({ username: "admin" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user with plain password (will be hashed by the model)
    const adminUser = {
      username: "admin",
      email: "admin@lawyermajed.com",
      password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJjd/nQSe", // "admin123" hashed
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await users.insertOne(adminUser)
    console.log("Admin user created successfully!")
    console.log("Username: admin")
    console.log("Password: admin123")
    console.log("Please change the password after first login")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await client.close()
  }
}

createAdminUser()
