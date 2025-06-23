const { OAuth2Client } = require("google-auth-library");
const readline = require("readline");
require("dotenv").config({ path: __dirname + "/.env" });

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5001/auth/callback" // Must match Google Cloud Console
);

const scopes = ["https://www.googleapis.com/auth/gmail.send"];

// Generate the authorization URL
const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  response_type: "code",
  prompt: "consent",
  scope: scopes,
});

console.log("🔗 Authorize this app by visiting this URL:");
console.log(url);
console.log(
  '\nAfter authorizing, copy the "code" query parameter from the redirect URL.'
);
// console.log(
//   "Example: http://localhost:5001/auth/callback?code=<YOUR_CODE_HERE>"
// );

// Create readline interface to prompt for the code
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nPaste the authorization code here: ", async code => {
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log("✅ Access Token:", tokens.access_token);
    console.log("🔁 Refresh Token:", tokens.refresh_token);
    console.log(
      "⚠️ Save the refresh token in your .env file as GOOGLE_REFRESH_TOKEN:",
      tokens.refresh_token
    );
  } catch (error) {
    console.error(
      "❌ Error exchanging code for tokens:",
      error.response?.data || error.message
    );
  } finally {
    rl.close();
  }
});

// const { OAuth2Client } = require("google-auth-library");
// require("dotenv").config();

// const oauth2Client = new OAuth2Client(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   "http://localhost:5001/auth/callback"
// );

// // Define the scope you want to request
// const scopes = ["https://mail.google.com/"];

// // Generate the URL
// const url = oauth2Client.generateAuthUrl({
//   access_type: "offline",
//   prompt: "consent", // Always ask user to approve so you get refresh_token
//   response_type: "code",
//   scope: scopes,
//   // response_type: "code",
// });

// console.log("🔗 Authorize this app by visiting this URL:\n\n" + url + "\n");
