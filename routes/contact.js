const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { google } = require("googleapis");
const { oauth2Client } = require("../utils/googleOAuth");

// POST /api/contact
router.post("/api/contact", async (req, res) => {
  console.log("📩 Received contact data:", req.body);

  try {
    const { from_email, from_name, subject, message } = req.body;

    // 1. Save to MongoDB
    const newContact = new Contact({
      from_email,
      from_name,
      subject,
      message,
    });
    await newContact.save();
    console.log("✅ Data saved to MongoDB:", newContact);

    // 2. Get new access token from OAuth2 client
    const { token } = await oauth2Client.getAccessToken();
    if (!token) {
      throw new Error("Failed to obtain access token.");
    }

    // 3. Initialize Gmail API client
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // 4. Compose plain text email message
    const emailMessage = [
      `From: ${from_name} <${from_email}>`,
      `To: ${process.env.EMAIL_USER}`,
      `Subject: Portfolio Contact: ${subject}`,
      "",
      `You received a new message from ${from_name} (${from_email}):`,
      "",
      `${message}`,
    ].join("\n");

    // 5. Encode to base64 (as per Gmail API spec)
    const encodedEmail = Buffer.from(emailMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // 6. Send email using Gmail API
    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    });

    console.log("✅ Email sent successfully:", result.data.id);

    // 7. Send acknowledgement email back to the user
    const autoReplyMessage = [
      `To: ${from_email}`,
      `From: ${process.env.EMAIL_USER}`,
      `Subject: Re: Portfolio Contact Received`,
      "",
      `Hi ${from_name},`,
      "",
      `Thank you for reaching out! I've received your message regarding "${subject}".`,
      "I will get back to you as soon as I can.",
      "",
      "Best regards,",
      "Gezagn Bekele",
    ].join("\n");

    const encodedReply = Buffer.from(autoReplyMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedReply,
      },
    });

    console.log("✅ Auto-reply sent to user:", from_email);

    // 7. Respond to frontend
    res.status(200).json({ message: "Message sent and saved successfully!" });
  } catch (error) {
    console.error("❌ Error in contact submission:", error.message);
    res
      .status(500)
      .json({ error: "Failed to send message. Please try again later." });
  }
});

module.exports = router;
