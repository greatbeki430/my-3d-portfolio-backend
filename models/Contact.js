const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  from_email: { type: String, required: true, trim: true },
  from_name: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", contactSchema);
