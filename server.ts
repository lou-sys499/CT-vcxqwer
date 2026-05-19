import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email route (Mailtrap)
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, text } = req.body;
    
    if (!to || !subject || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Support an array or a single string
    const recipients = Array.isArray(to) ? to.map(e => ({ email: e })) : [{ email: to }];
    
    const mailtrapKey = process.env.MAILTRAP_API_KEY;
    if (!mailtrapKey) {
      return res.status(500).json({ error: "MAILTRAP_API_KEY is not configured" });
    }

    try {
      const client = new MailtrapClient({ token: mailtrapKey });
      
      const sender = {
        email: "hello@demomailtrap.com",
        name: "CordlessToolz Notifications",
      };
      
      await client.send({
        from: sender,
        to: recipients,
        subject: subject,
        text: text,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Mailtrap Error:", error);
      res.status(500).json({ error: error.message || "Failed to send email" });
    }
  });

  // Gemini API route
  app.post("/api/summarize", async (req, res) => {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description required" });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Summarize this product description into 3 bullet points, using a professional tone: ${description}`;
      const result = await model.generateContent(prompt);
      const summary = result.response.text();
      res.json({ summary });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to summarize" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
