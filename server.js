const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoutes = require("./routes/admin");

require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
const port = process.env.PORT || 5001;

const isDev = process.env.NODE_ENV === "development";
const mongoUri = isDev
  ? process.env.MONGO_URI_LOCAL
  : process.env.MONGO_URI_ATLAS;
  const chatbotRoutes = require("./routes/chatbot");
console.log("Running in:", process.env.NODE_ENV || "production");
console.log("MongoDB URI being used:", mongoUri);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://gportfolio-frontend.onrender.com", // <-- ADD your real frontend domain
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api", require("./routes/contact"));
app.use("/api", chatbotRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
