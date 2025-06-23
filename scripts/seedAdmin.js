const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("../models/Admin");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedAdmin() {
  const hashedPassword = await bcrypt.hash("Ggeze%%##12aa", 10);
  const admin = new Admin({
    email: "greatbeki22@admin.email",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("✅ Admin seeded");
  process.exit();
}

seedAdmin();
