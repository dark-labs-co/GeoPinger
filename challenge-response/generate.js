const crypto = require("crypto");

function generateChallenge(difficulty) {
  const nonce = crypto.randomBytes(16).toString("hex");
  const target = "0".repeat(difficulty);
  return { nonce, target };
}
