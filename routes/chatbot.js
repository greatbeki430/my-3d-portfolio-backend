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
  am: {
    default: "ይቅርታ፣ ያንን ገና አልገባኝም። ስለ ፕሮጀክቶች፣ ችሎታዎች፣ ዳራ፣ ሲቪ፣ ወይም ሌላ መጠየቅ ይችላሉ!",
    greeting:
      "ሰላም! እኔ የግዛኝ ረዳት ነኝ። ስለ ፕሮጀክቶቼ፣ ችሎታዎቼ፣ ልምዶቼ፣ ወይም እንዴት መገናኘት እንደምችል ይጠይቁኝ!",
    tips: "እርዳታ ልሰጥዎ የምችለው፡ ፕሮጀክቶች፣ ችሎታዎች፣ ግንኙነት፣ ሲቪ፣ ሰርተፊኬቶች፣ ትምህርት፣ ብሎግ፣ ምስክርነቶች፣ የትርፍ ጊዜ ማሳለፊያዎች፣ እና ሌሎችም!",
  },
  om: {
    default:
      "Dhiifama, kana gochuuf hin leenjine. Projektoota, dandeettii ani qabu, seenaakoo, CV, Resume ykn kan biroo gaafachuu dandeessu!",
    greeting:
      "Akkam! Ani gargaaraa Gezagn dha. Projektoota koo, dandeettii koo, muuxannoo koo, ykn akkamitti na qunnamuu akka dandeessan gaafachuu ni dandeessu!",
    tips: "Kanan ani sin gargaaruu danda’u: Projektoota, Dandeettii, Qunnamtii, CV, Resume, Ragaa, Barnoota, Blog, Ragaa namaa, Hawwiikoo fi kkf!",
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

  // Default to English if language is not supported
  const selectedLang = translations[lang] ? lang : "en";
  let response = { type: "text", content: translations[selectedLang].default };

  if (!conversationContext[userId]) {
    conversationContext[userId] = { lastTopic: null };
  }

  const keywords = [
    // Greeting
    {
      match: [
        // English
        "hello",
        "hi",
        "hey",
        "greetings",
        // Amharic
        "ሰላም",
        "ሃይ",
        "ሄይ",
        // Afan Oromo
        "akkam",
        "Nagaadhaa",
        "Akkam jirta",
        "Waa'ee kee"
      ],
      action: () => {
        response.content = translations[selectedLang].greeting;
        conversationContext[userId].lastTopic = "greeting";
      },
    },
    // About Me
    {
      match: [
        // English
        "about you",
        "who are you",
        "yourself",
        "about yourself",
        "tell me about you",
        "who is gezagn",
        // Amharic
        "ስለ አንተ",
        "ማን ነህ",
        "ራስህን",
        "ስለ አንተ ንገረኝ",
        "ግዛኝ ማነዊ",
        // Afan Oromo
        "waa'ee kee",
        "eenyu",
        "ati eenyudha",
        "eenyummaakee",
        "Waa'ee kee natti himi",
        "gezagn eenyu",
      ],
      action: () => {
        response.content =
          selectedLang === "am"
            ? "እኔ ግዛኝ በቀለ ነኝ፣ በድር ልማት፣ ኤአይ፣ እና ሳይበር ደህንነት ልዩ እውቀት ያለኝ ሶፍትዌር መሐንዲስ።"
            : selectedLang === "om"
            ? "Ani Gezagn Bekele'n jedhama, Software Engineeriidha. Web Development, AI(Aartifishaal Intelegensii), Networking fi Cybersecurity irratti hojjechuu nan danda'a."
            : "I'm Gezagn Bekele, a passionate Software Engineer with expertise in Web Development, AI, and Cybersecurity. I specialize in building modern, responsive web applications, exploring artificial intelligence solutions, and improving security for digital platforms. I'm also dedicated to continuous learning, open-source contributions, and helping businesses bring their ideas to life through technology.";
        conversationContext[userId].lastTopic = "about";
      },
    },
    // Experience
    {
      match: [
        // English
        "experience",
        "work history",
        "what experience do you have",
        "tell me your experience",
        // Amharic
        "ልምድ",
        "የሥሮች ታሪክ",
        "ምን ልምድ አለህ",
        "ልምድህን ንገረኝ",
        // Afan Oromo
        "muuxannoo",
        "muuxannoo kee ",
        "seenaa hojii",
        "muuxannoo maali qabda",
        "muuxannoo kee natti himi",
      ],
      action: () => {
        response.content =
          selectedLang === "am"
            ? "የተሟላ የድር መተግበሪያዎች፣ የሞባይል መተግበሪያዎች እና በኤአይ ፕሮጀክቶች ላይ የተግባር ልምድ አለኝ።"
            : selectedLang === "om"
            ? "Full-stack website (midiyaa hawaasaa), appii mobaayila, fi projektoota AI irratti muuxannoo hojii nan qaba."
            : "I have hands-on experience building full-stack apps, mobile apps, and working on AI projects.";
        conversationContext[userId].lastTopic = "experience";
      },
    },
    // Skills
    {
      match: [
        // English
        "skills",
        "technologies",
        "tech stack",
        "what skills do you have",
        "tell me your skills",
        "what can you build",
        // Amharic
        "ችሎታዎች",
        "ቴክኖሎጂዎች",
        "የቴክ ቁልል",
        "ምን ችሎታ አለህ",
        "ችሎታዎችህን ንገረኝ",
        "ምን መገንባት ትችላለህ",
        // Afan Oromo
        "dandeettii",
        "dandeettii kee",
        "teeknooloojii",
        "tech stack",
        "dandeettii maali qabda",
        "dandeettii kee natti himi",
        "maali hojjetta",
      ],
      action: () => {
        response.type = "list";
        response.content = {
          message:
            selectedLang === "am"
              ? "ዋና ችሎታዎቼ እነዚህ ናቸው:"
              : selectedLang === "om"
              ? "Dandeettiiwwan koo kanneen ijoon:"
              : "Here are my key skills:",
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
        // English
        "location",
        "where are you",
        "where are you based",
        "where do you live",
        // Amharic
        "አካባቢ",
        "የት ነህ",
        "የት ተመስርተህ ነው",
        "የት ትኖራለህ",
        // Afan Oromo
        "iddoo",
        "eessa jirta",
        "eessarraati",
        "eessa jiraatta",
      ],
      action: () => {
        response.content =
          selectedLang === "am"
            ? "በኢትዮጵያ ተመስርቼ ነው ግን በርቀት እድሎች በዓለም አቀፍ ደረጃ እሰራለሁ።"
            : selectedLang === "om"
            ? "Bakki ani jiru ykn jiraadhu Itiyoophiyaa keessa yoo ta'u garuu carraa biyya keessa taa'uun fageenyarratti (Remote) hojjechuus nan  danda'a."
            : "I'm based in Ethiopia but work globally through remote opportunities.";
        conversationContext[userId].lastTopic = "location";
      },
    },
    // Contact
    {
      match: [
        // English
        "contact",
        "connect",
        "reach you",
        "how can i contact you",
        "how to reach you",
        // Amharic
        "ግንኙነት",
        "መገናኘት",
        "እንዴት ልገናኝህ",
        "እንዴት መገናኘት እችላለሁ",
        // Afan Oromo
        "qunnamtii",
        "walqunnamuu ni dandeenyaa",
        "akkamitti si qunnama",
        "akkamittin si qunnamuu danda’a",
      ],
      action: () => {
        response.type = "contact";
        response.content = {
          message:
            selectedLang === "am"
              ? "በሚከተሉት መገናኘት ይችላሉ:"
              : selectedLang === "om"
              ? "Karaalee kanneeniin na qunnamuu ni dandeessu:"
              : "You can reach me via:",
          email: "gezbekele@ju2.edu.et",
          linkedin: "https://linkedin.com/in/gezahegn",
          github: "https://github.com/gezahegn",
          phone:"+251915379958/+251961305788",
          facebook:""
        };
        conversationContext[userId].lastTopic = "contact";
      },
    },
    // Availability
    {
      match: [
        // English
        "available",
        "availability",
        "hire you",
        "are you available",
        "can i hire you",
        // Amharic
        "ይገኛል",
        "መገኘት",
        "መቅጠር",
        "ይገኛል ነው",
        "መቅጠር እችላለሁ",
        // Afan Oromo
        "jiraachuu",
        "jiraachuu kee",
        "si bitachuu",
        "jirtaa",
        "si bitachuu danda’a",
      ],
      action: () => {
        response.content =
          selectedLang === "am"
            ? "ለነጻ ሥራ እና ለርቀት የሙሉ ጊዜ ሥራ ይገኛል። በነጻ መገናኘት ይሞክሩ!"
            : selectedLang === "om"
            ? "Hojii bilisummaa fi hojii yeroo guutuu mamaa’amaaf jira. Bilisummaan na qunnami!"
            : "I'm available for freelance and remote full-time work. Feel free to connect!";
        conversationContext[userId].lastTopic = "availability";
      },
    },
    // Languages
    {
      match: [
        // English
        "languages",
        "what languages do you speak",
        "which languages",
        "languages you know",
        // Amharic
        "ቋንቋዎች",
        "ምን ቋንቋዎች ትናገራለህ",
        "የትኞቹ ቋንቋዎች",
        "ምን ቋንቋዎች ታውቃለህ",
        // Afan Oromo
        "afaan",
        "afaan maali dubbata",
        "afaan kami",
        "afaan maali beekta",
      ],
      action: () => {
        response.type = "list";
        response.content = {
          message:
            selectedLang === "am"
              ? "እነዚህን ቋንቋዎች እገናኛለሁ:"
              : selectedLang === "om"
              ? "Afaan kanneen walqunnama:"
              : "I communicate in:",
          items: ["English", "Amharic", "Afaan Oromo"],
        };
        conversationContext[userId].lastTopic = "languages";
      },
    },
    // AI/ML
    {
      match: [
        // English
        "ai",
        "artificial intelligence",
        "machine learning",
        "ml",
        "do you know ai",
        // Amharic
        "ኤአይ",
        "ሰው ሰራሽ እውቀት",
        "ማሽን መማር",
        "ኤምኤል",
        "ኤአይ ታውቃለህ",
        // Afan Oromo
        "AI",
        "Artificial Intelligence",
        "Machine Learning",
        "ML",
        "AI beekta",
      ],
      action: () => {
        response.content =
          selectedLang === "am"
            ? "አዎ፣ በኤአይ እና ማሽን መማር ላይ ጠንካራ ልምድ አለኝ፣ ኤአይ ላይ ያተኮሩ ፕሮጀክቶችን ጨምሮ።"
            : selectedLang === "om"
            ? "Eeyyee, AI fi Machine Learning irratti muuxannoo cimaa qaba, projektoota AI irratti kan xiyyeeffatan dabalatee."
            : "Yes, I have solid experience with AI and Machine Learning, including AI-focused projects.";
        conversationContext[userId].lastTopic = "ai";
      },
    },
    // Certifications
    {
      match: [
        // English
        "certifications",
        "certificate",
        "what certifications do you have",
        // Amharic
        "ሰርተፊኬቶች",
        "ሰርተፊኬት",
        "ምን ሰርተፊኬቶች አሉህ",
        // Afan Oromo
        "ragaa",
        "sartifikeetii",
        "sartifikeetii maali qabda",
      ],
      action: () => {
        response.type = "list";
        response.content = {
          message:
            selectedLang === "am"
              ? "የእኔ ሰርተፊኬቶች እነኚህ ናቸው:"
              : selectedLang === "om"
              ? "Ragaan koo kanneen:"
              : "Here are my certifications:",
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
        // English
        "education",
        "degree",
        "what did you study",
        "where did you study",
        // Amharic
        "ትምህርት",
        "ዲግሪ",
        "ምን ተምረሃል",
        "የት ተምረሃል",
        // Afan Oromo
        "barnoota",
        "digirii",
        "maali baratte",
        "eessatti baratte",
      ],
      action: () => {
        response.type = "list";
        response.content = {
          message:
            selectedLang === "am"
              ? "የእኔ የትምህርት ዳራ:"
              : selectedLang === "om"
              ? "Seenaa barnoota koo:"
              : "My educational background:",
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
      match: [
        // English
        "cv",
        "resume",
        "download your cv",
        "can i see your cv",
        // Amharic
        "ሲቪ",
        "የሥራ መገለጫ",
        "ሲቪህን ማውረድ",
        "ሲቪህን ማየት እችላለሁ",
        // Afan Oromo
        "CV",
        "resuumii",
        "CV kee buufachuu",
        "CV kee ilaaluu danda’a",
      ],
      action: () => {
        response.type = "link";
        response.content = {
          message:
            selectedLang === "am"
              ? "ሲቪዬን አውርድ:"
              : selectedLang === "om"
              ? "CV koo buufadhu:"
              : "Download my CV:",
          url: "https://yourportfolio.com/cv.pdf",
          text:
            selectedLang === "am"
              ? "የግዛኝ ሲቪ"
              : selectedLang === "om"
              ? "CV Gezagn"
              : "Gezagn's CV",
        };
        conversationContext[userId].lastTopic = "cv";
      },
    },
    // Help
    {
      match: [
        // English
        "help",
        "what can you do",
        "services",
        "how can you help me",
        // Amharic
        "እርዳታ",
        "ምን ማድረግ ትችላለህ",
        "አገልግሎቶች",
        "እንዴት ልረዳኝ ትችላለህ",
        // Afan Oromo
        "gargaarsa",
        "maali gochuu dandeessa",
        "tajaajila",
        "akkamitti na gargaara",
      ],
      action: () => {
        response.type = "list";
        response.content = {
          message: translations[selectedLang].tips,
          items: [
            selectedLang === "am"
              ? "ፕሮጀክቶቼን ተመልከት"
              : selectedLang === "om"
              ? "Projektoota koo ilaali"
              : "View my projects",
            selectedLang === "am"
              ? "ስለ ችሎታዎቼ ተማር"
              : selectedLang === "om"
              ? "Dandeettii koo baradhu"
              : "Learn about my skills",
            selectedLang === "am"
              ? "ሲቪዬን አውርድ"
              : selectedLang === "om"
              ? "CV koo buufadhu"
              : "Download my CV",
            selectedLang === "am"
              ? "እኔን አግኝ"
              : selectedLang === "om"
              ? "Na qunnami"
              : "Contact me",
            selectedLang === "am"
              ? "ሰርተፊኬቶቼን ተመልከት"
              : selectedLang === "om"
              ? "Ragaa koo ilaali"
              : "See my certifications",
            selectedLang === "am"
              ? "ትምህርቴን ፈትሽ"
              : selectedLang === "om"
              ? "Barnoota koo baradhu"
              : "Check my education",
            selectedLang === "am"
              ? "ብሎጌን አንብብ"
              : selectedLang === "om"
              ? "Blog koo dubbisi"
              : "Read my blog",
            selectedLang === "am"
              ? "ምስክርነቶችን ተመልከት"
              : selectedLang === "om"
              ? "Ragaa namaa ilaali"
              : "View testimonials",
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
  if (
    (conversationContext[userId].lastTopic && lowerMsg.includes("more")) ||
    lowerMsg.includes("ተጨማሪ") ||
    lowerMsg.includes("dabalu")
  ) {
    if (conversationContext[userId].lastTopic === "projects") {
      response.content =
        selectedLang === "am"
          ? "ስለ ፕሮጀክቶች እንደ 'የአደጋ ጊዜ ቦታ ማስያዣ ስርዓት' ወይም 'ፖርትፎሊዮ ድር ጣቢያ' ዝርዝሮችን ይፈልጋሉ? ብቻ ይጠይቁ!"
          : selectedLang === "om"
          ? "Projektoota akka ‘Emergency Booking System’ ykn ‘Portfolio Website’ irratti odeeffannoo barbaaddan? Gaafachuu ni dandeessu!"
          : "Want details on projects like 'Emergency Booking System' or 'Portfolio Website'? Just ask!";
    } else if (conversationContext[userId].lastTopic === "skills") {
      response.content =
        selectedLang === "am"
          ? "በተወሰኑ ችሎታዎች ፍላጎት አለህ? ስለ 'React'፣ 'Node.js' ወይም 'AI' ጠይቅ!"
          : selectedLang === "om"
          ? "Dandeettii adda addaa irratti yaada qabda? ‘React’, ‘Node.js’, ykn ‘AI’ irratti gaafadhu!"
          : "Interested in specific skills? Ask about 'React', 'Node.js', or 'AI'!";
    }
  }

  res.json(response);
});

module.exports = router;
