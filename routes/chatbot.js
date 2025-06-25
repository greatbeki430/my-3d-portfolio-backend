// backend/routes/chatbot.js
const express = require("express");
const router = express.Router();
const sanitizeHtml = require("sanitize-html");

// Translations for multi-language support
const translations = {
  en: {
    default:
      "Sorry, I don't understand that yet. Try asking about projects, skills, contact, CV, or more!",
    greeting:
      "Hello! I'm Gezagn's assistant. Ask about my projects, skills, or how to connect!",
    tips: "I can help with: Projects, Skills, Contact, CV, Certifications, Education, Blog, Testimonials, or more!",
  },
  am: {
    default: "ይቅርታ፣ ያን ገና አልገባኝም። ስለ ፕሮጀክቶች፣ ችሎታዎች፣ እውቂያ፣ ሲቪ ወይም ሌላ ይጠይቁ!",
    greeting: "ሰላም! የገዛኝ ረዳት ነኝ። ስለ ፕሮጀክቶቼ፣ ችሎታዎቼ ወይም እንዴት መገናኘት እንደምችል ይጠይቁ።",
    tips: "እኔ መርዳት የምችለው፡ ፕሮጀክቶች፣ ችሎታዎች፣ እውቂያ፣ ሲቪ፣ ሰርተፊኬቶች፣ ትምህርት፣ ብሎግ፣ ምስክርነቶች ወይም ሌላ!",
  },
};

// Context for follow-up questions
let conversationContext = {};

router.post("/chat", (req, res) => {
  const { message, lang = "en", userId = "guest" } = req.body;
  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const lowerMsg = sanitizedMessage.toLowerCase();
  let response = {
    type: "text",
    content: translations[lang].default,
  };

  // Initialize user context
  if (!conversationContext[userId]) {
    conversationContext[userId] = { lastTopic: null };
  }

  // Greeting
  if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
    response.content = translations[lang].greeting;
    conversationContext[userId].lastTopic = "greeting";
  }
  // Experience
  else if (lowerMsg.includes("experience")) {
    response.content =
      "I have hands-on experience building full-stack web apps, mobile apps, and contributing to projects like emergency booking systems and organizational websites.";
    conversationContext[userId].lastTopic = "experience";
  }
  // About
  else if (lowerMsg.includes("about you") || lowerMsg.includes("who are you")) {
    response.content =
      "I'm Gezagn Bekele, a passionate Software Engineer specializing in Web Development, AI, and modern tech stacks.";
    conversationContext[userId].lastTopic = "about";
  }
  // Location
  else if (lowerMsg.includes("location") || lowerMsg.includes("based")) {
    response.content =
      "I'm based in Ethiopia but open to remote opportunities globally.";
    conversationContext[userId].lastTopic = "location";
  }
  // Languages
  else if (lowerMsg.includes("language")) {
    response.type = "list";
    response.content = {
      message: "I communicate in:",
      items: ["English", "Amharic", "Afaan Oromo"],
    };
    conversationContext[userId].lastTopic = "languages";
  }
  // AI/ML
  else if (lowerMsg.includes("ai") || lowerMsg.includes("machine learning")) {
    response.content =
      "I have foundational knowledge in AI and Machine Learning, with experience in AI-focused projects.";
    conversationContext[userId].lastTopic = "ai";
  }
  // Networking/Cybersecurity
  else if (
    lowerMsg.includes("networking") ||
    lowerMsg.includes("cybersecurity")
  ) {
    response.content =
      "I'm expanding my expertise in Networking and Cybersecurity through practical and theoretical studies.";
    conversationContext[userId].lastTopic = "networking";
  }
  // Hobbies
  else if (lowerMsg.includes("hobbies") || lowerMsg.includes("interests")) {
    response.content =
      "In my free time, I enjoy exploring new tech, reading about AI advancements, and contributing to open-source projects.";
    conversationContext[userId].lastTopic = "hobbies";
  }
  // Availability
  else if (
    lowerMsg.includes("available") ||
    lowerMsg.includes("availability")
  ) {
    response.content =
      "I'm currently available for freelance and remote full-time opportunities. Feel free to reach out!";
    conversationContext[userId].lastTopic = "availability";
  }
  // Help/Suggestions
  else if (lowerMsg.includes("what can you do") || lowerMsg.includes("help")) {
    response.type = "list";
    response.content = {
      message: translations[lang].tips,
      items: [
        "View my projects",
        "Learn about my skills",
        "Download my CV",
        "Contact me",
        "See my certifications",
        "Check my education",
        "Read my blog",
        "View testimonials",
      ],
    };
    conversationContext[userId].lastTopic = "help";
  }
  // Follow-up
  else if (conversationContext[userId].lastTopic && lowerMsg.includes("more")) {
    if (conversationContext[userId].lastTopic === "projects") {
      response.content =
        "Want details on a specific project like 'Emergency Booking System' or 'Portfolio Website'?";
    } else if (conversationContext[userId].lastTopic === "skills") {
      response.content =
        "Interested in a specific skill? Ask about 'React' or 'Node.js' for more details!";
    } else if (conversationContext[userId].lastTopic === "greeting") {
      response.content = translations[lang].tips;
    }
  }

  res.json(response);
});

module.exports = router;
