const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// Add near other route imports:
const adminRoutes = require('./routes/admin');
// require("dotenv").config();
require("dotenv").config({ path: __dirname + "/.env" });

console.log("MONGO_URI:", process.env.MONGO_URI); // Debug line
const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Matches React dev server
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Admin routes
app.use('/api/admin', adminRoutes);

// Routes
app.use("/", require("./routes/contact"));

// Analaytics routes:
// app.use('/api/analytics', analyticsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
