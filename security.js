// security.js
const securityMiddleware = [
  helmet(), // Security headers
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
  express.json({ limit: "10kb" }), // Body size limit
];
