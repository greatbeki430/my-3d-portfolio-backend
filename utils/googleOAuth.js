const { OAuth2Client } = require("google-auth-library");
// require("dotenv").config();
require("dotenv").config({ path: __dirname + "/.env" });

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5001/auth/callback"
);

// Set credentials if refresh token is available
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
}

module.exports = { oauth2Client };
