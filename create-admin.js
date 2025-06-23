const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const bcrypt = require("bcrypt");
const hashedPassword = bcrypt.hashSync("Ggeze%%##12aa", 10);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/portfolio")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Function to create admin
async function createAdmin() {
  try {
    // const admin = new Admin({
    //   email: "programmergezy@example.com",
    //   password: "Ggeze%%##12aa",
    //   role: "superadmin", // Optional: 'admin' or 'superadmin'
    // });
    const admin = new Admin({
      email: "greatbeki22@admin.email",
      password: hashedPassword,
      role: "superadmin",
    });
    await admin.save();
    console.log("Admin user created:", admin);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
