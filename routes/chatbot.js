const express = require("express");
const router = express.Router();
const sanitizeHtml = require("sanitize-html");

const translations = {
  en: {
    default:
      "Sorry, I don't understand that yet. You can ask about projects, skills, background, CV, or more!",
    greeting:
      "Hello! I'm Gezagn's assistant. Ask me about my projects, skills, experience, or how to contact me!",
    tips: "I can help with: Projects, Skills, Contact, CV, Certifications, Education, Blog, Testimonials, Hobbies, and more!",
  },
};

let conversationContext = {};

router.post("/chat", (req, res) => {
  const { message, lang = "en", userId = "guest" } = req.body;
  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const lowerMsg = sanitizedMessage.toLowerCase();

  let response = { type: "text", content: translations[lang].default };

  if (!conversationContext[userId]) {
    conversationContext[userId] = { lastTopic: null };
  }

  const keywords = [
    // Greeting
    {
      match: ["hello", "hi", "hey", "greetings"],
      action: () => {
        response.content = translations[lang].greeting;
        conversationContext[userId].lastTopic = "greeting";
      },
    },
    // About Me
    {
      match: [
        "about you",
        "who are you",
        "yourself",
        "tell me about you",
        "who is gezagn",
      ],
      action: () => {
        response.content =
          "I'm Gezagn Bekele, a Software Engineer with expertise in Web Development, AI, and Cybersecurity.";
        conversationContext[userId].lastTopic = "about";
      },
    },
    // Experience
    {
      match: [
        "experience",
        "work history",
        "what experience do you have",
        "tell me your experience",
      ],
      action: () => {
        response.content =
          "I have hands-on experience building full-stack apps, mobile apps, and working on AI projects.";
        conversationContext[userId].lastTopic = "experience";
      },
    },
    // Skills
    {
      match: [
        "skills",
        "technologies",
        "tech stack",
        "what skills do you have",
        "tell me your skills",
        "what can you build",
      ],
      action: () => {
        response.type = "list";
        response.content = {
          message: "Here are my key skills:",
          items: [
            "JavaScript",
            "React",
            "Node.js",
            "Express",
            "MongoDB",
            "Python",
            "Networking",
            "AI & ML Basics",
          ],
        };
        conversationContext[userId].lastTopic = "skills";
      },
    },
    // Location
    {
      match: [
        "location",
        "where are you",
        "where are you based",
        "where do you live",
      ],
      action: () => {
        response.content =
          "I'm based in Ethiopia but work globally through remote opportunities.";
        conversationContext[userId].lastTopic = "location";
      },
    },
    // Contact
    {
      match: [
        "contact",
        "connect",
        "reach you",
        "how can i contact you",
        "how to reach you",
      ],
      action: () => {
        response.type = "contact";
        response.content = {
          message: "You can reach me via:",
          email: "gezahegn@example.com",
          linkedin: "https://linkedin.com/in/gezahegn",
          github: "https://github.com/gezahegn",
        };
        conversationContext[userId].lastTopic = "contact";
      },
    },
    // Availability
    {
      match: [
        "available",
        "availability",
        "hire you",
        "are you available",
        "can i hire you",
      ],
      action: () => {
        response.content =
          "I'm available for freelance and remote full-time work. Feel free to connect!";
        conversationContext[userId].lastTopic = "availability";
      },
    },
    // Languages
    {
      match: [
        "languages",
        "what languages do you speak",
        "which languages",
        "languages you know",
      ],
      action: () => {
        response.type = "list";
        response.content = {
          message: "I communicate in:",
          items: ["English", "Amharic", "Afaan Oromo"],
        };
        conversationContext[userId].lastTopic = "languages";
      },
    },
    // AI/ML
    {
      match: [
        "ai",
        "artificial intelligence",
        "machine learning",
        "ml",
        "do you know ai",
      ],
      action: () => {
        response.content =
          "Yes, I have solid experience with AI and Machine Learning, including AI-focused projects.";
        conversationContext[userId].lastTopic = "ai";
      },
    },
    // Certifications
    {
      match: [
        "certifications",
        "certificate",
        "what certifications do you have",
      ],
      action: () => {
        response.type = "list";
        response.content = {
          message: "Here are my certifications:",
          items: [
            "Cisco Cybersecurity Essentials",
            "AI Fundamentals - IBM",
            "Networking Basics - Cisco",
          ],
        };
        conversationContext[userId].lastTopic = "certifications";
      },
    },
    // Education
    {
      match: [
        "education",
        "degree",
        "what did you study",
        "where did you study",
      ],
      action: () => {
        response.type = "list";
        response.content = {
          message: "My educational background:",
          items: [
            "BSc in Software Engineering - Jimma University",
            "AI & Cybersecurity Training - Online",
          ],
        };
        conversationContext[userId].lastTopic = "education";
      },
    },
    // CV
    {
      match: ["cv", "resume", "download your cv", "can i see your cv"],
      action: () => {
        response.type = "link";
        response.content = {
          message: "Download my CV:",
          url: "https://yourportfolio.com/cv.pdf",
          text: "Gezagn's CV",
        };
        conversationContext[userId].lastTopic = "cv";
      },
    },
    // Help
    {
      match: ["help", "what can you do", "services", "how can you help me"],
      action: () => {
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
      },
    },
  ];

  for (const keyword of keywords) {
    if (keyword.match.some(k => lowerMsg.includes(k))) {
      keyword.action();
      break;
    }
  }

  // Follow-up (More)
  if (conversationContext[userId].lastTopic && lowerMsg.includes("more")) {
    if (conversationContext[userId].lastTopic === "projects") {
      response.content =
        "Want details on projects like 'Emergency Booking System' or 'Portfolio Website'? Just ask!";
    } else if (conversationContext[userId].lastTopic === "skills") {
      response.content =
        "Interested in specific skills? Ask about 'React', 'Node.js', or 'AI'!";
    }
  }

  res.json(response);
});

module.exports = router;
