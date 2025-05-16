import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 3001; // You can choose a different port if needed

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON request bodies

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY not found in .env file. Please ensure it is set.");
  process.exit(1); // Exit if API key is not found
}
const googleGenerativeAI = new GoogleGenerativeAI(apiKey);

// Use the model name that worked for you, e.g., "gemini-1.0-pro" or "gemini-1.5-flash-latest"
// The user's last visible code used "gemini-2.0-flash", let's assume that's intended.
// If "gemini-2.0-flash" gives errors, try "gemini-1.0-pro" or "gemini-1.5-flash-latest".
const modelName = "gemini-2.0-flash"; // Or "gemini-1.5-flash-latest" or "gemini-2.0-flash" if that worked
const model = googleGenerativeAI.getGenerativeModel({ model: modelName });

app.post("/api/health-impact", async (req, res) => {
  try {
    const { environmentalFactor } = req.body;

    if (!environmentalFactor || typeof environmentalFactor !== 'string' || environmentalFactor.trim() === '') {
      return res.status(400).json({ error: "Environmental factor is required and must be a non-empty string." });
    }

    const prompt = `Summarize the impact of ${environmentalFactor.trim()} on human health. Focus on the relationship between this environmental impact and specific health outcomes. Provide a concise summary.`;

    console.log(`Received request for: ${environmentalFactor.trim()}, using model: ${modelName}`);
    console.log(`Generated prompt: ${prompt}`);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ summary: text });
  } catch (error) {
    console.error("Error processing request:", error);
    // Check for specific API errors if possible
    if (error.message && error.message.includes("API key not valid")) {
        res.status(401).json({ error: "API key not valid. Please check your .env file." });
    } else if (error.message && error.message.includes("quota")) {
        res.status(429).json({ error: "API quota exceeded. Please check your usage." });
    } else {
        res.status(500).json({ error: "Failed to generate health impact summary. " + error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log(`Ensure your .env file has the API_KEY set correctly.`);
});