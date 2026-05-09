const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const COMMON_PASSWORDS = [
  "password",
  "123456",
  "qwerty",
  "abc123",
  "password1",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "dragon"
];

// Calculate entropy
function calculateEntropy(password) {
  let charsetSize = 0;

  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

  const entropy = Math.round(
    password.length * Math.log2(charsetSize || 1)
  );

  return { entropy, charsetSize };
}

// Convert crack time
function formatCrackTime(seconds) {
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;

  return `${Math.round(seconds / 31536000)} years`;
}

// API route
app.post("/api/analyze", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      error: "Password is required"
    });
  }

  let score = 0;

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  if (hasLength) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;

  const isCommon = COMMON_PASSWORDS.includes(
    password.toLowerCase()
  );

  const { entropy, charsetSize } =
    calculateEntropy(password);

  const crackTimeSeconds =
    Math.pow(2, entropy) / 10000000000;

  let strengthLabel = "Weak";
  let suggestion =
    "Use uppercase, lowercase, numbers and symbols.";

  if (score >= 5 && !isCommon) {
    strengthLabel = "Strong";
    suggestion = "Excellent password.";
  } else if (score >= 3) {
    strengthLabel = "Medium";
    suggestion =
      "Increase password length and add symbols.";
  }

  res.json({
    score,
    strengthLabel,
    entropy,
    charsetSize,
    length: password.length,
    crackTimeSeconds,
    crackTimeHuman: formatCrackTime(
      crackTimeSeconds
    ),
    isCommon,
    suggestion
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});