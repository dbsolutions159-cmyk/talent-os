const fs = require("fs");
const pdf = require("pdf-parse"); // ✅ सही import

async function parseResume(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdf(dataBuffer); // ✅ यहाँ pdf()

    return data.text;

  } catch (err) {
    console.error("❌ Resume Parse Error:", err.message);
    return "";
  }
}

module.exports = { parseResume };