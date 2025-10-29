import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the assets folder
app.use(express.static(path.join(__dirname, "assets")));

// Your OpenAI API key from .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Theo, a friendly AI companion for diabetics." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "No response.";
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
