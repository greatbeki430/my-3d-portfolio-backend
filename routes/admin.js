const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

// Admin login
router.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  // const admin = await Admin.findOne({ email }).select("+password");
  // if (!admin || !(await bcrypt.compare(password, admin.password))) {
  //   return res.status(401).json({ message: "Invalid credentials" });
  // }
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    // Ensure await
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_ADMIN_SECRET,
    { expiresIn: "1h" }
  );

  admin.lastLogin = Date.now();
  await admin.save();

  res.json({ token });
});

// Middleware to protect admin routes
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.admin = await Admin.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/dashboard", protect, (req, res) => {
  res.json({ message: "Admin dashboard" });
});
router.get("/verify", protect, (req, res) => {
  res.json({ status: "valid" });
});

router.get("/messages", protect, async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
});

module.exports = router;
