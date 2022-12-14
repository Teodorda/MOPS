require("dotenv").config();

module.exports = {
  BASE_URL: "https://dev-0ax460bs.eu.auth0.com/",
  oauth_token_url: `https://dev-0ax460bs.eu.auth0.com/oauth/token`,
  oauth_api_v2: `https://dev-0ax460bs.eu.auth0.com/api/v2/`,
  private_key: process.env.PRIVATE_KEY.split(String.raw`\n`).join("\n"),
};
