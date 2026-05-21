import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

import compression from "compression";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set X-Robots-Tag header to ensure indexing
  app.use((req, res, next) => {
    res.setHeader('X-Robots-Tag', 'index, follow');
    next();
  });

  app.use(compression());
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
      const client = new MailtrapClient({ 
        token: mailtrapKey,
        testInboxId: 4642502,
      });
      
      const sender = {
        email: "hello@example.com",
        name: "CordlessToolz Notifications",
      };
      
      await client.testing.send({
        from: sender,
        to: recipients,
        subject: subject,
        text: text,
        category: "Integration Test",
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

  // robots.txt route
  app.get("/robots.txt", (req, res) => {
    const baseUrl = process.env.CUSTOM_DOMAIN || `https://cordlesstoolz.com`;
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`);
  });

  // Sitemap route
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = process.env.CUSTOM_DOMAIN || `https://cordlesstoolz.com`;
      const staticRoutes = [
        '',
        '/blog',
        '/about',
        '/terms',
        '/privacy',
        '/shipping-policy',
        '/refund-policy',
        '/sitemap'
      ];

      res.setHeader("Content-Type", "application/xml");
      res.write('<?xml version="1.0" encoding="UTF-8"?>\n');
      res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

      // Add static routes
      for (const route of staticRoutes) {
        res.write('  <url>\n');
        res.write(`    <loc>${baseUrl}${route}</loc>\n`);
        res.write('    <changefreq>weekly</changefreq>\n');
        res.write('    <priority>0.8</priority>\n');
        res.write('  </url>\n');
      }

      try {
        const { getFirestoreProducts } = await import("./src/services/productService");
        const productsData = await getFirestoreProducts();
        for (const p of productsData) {
          res.write('  <url>\n');
          res.write(`    <loc>${baseUrl}/product/${p.id}</loc>\n`);
          res.write('    <changefreq>daily</changefreq>\n');
          res.write('    <priority>0.9</priority>\n');
          res.write('  </url>\n');
        }
      } catch (e) {
        console.warn("Failed fetching products for sitemap using SDK", e);
      }

      try {
        const { getFirestoreCategories } = await import("./src/services/productService");
        const categories = await getFirestoreCategories();
        for(const cat of categories) {
           res.write('  <url>\n');
           res.write(`    <loc>${baseUrl}/category/${cat.slug || cat.id}</loc>\n`);
           res.write('    <changefreq>weekly</changefreq>\n');
           res.write('    <priority>0.8</priority>\n');
           res.write('  </url>\n');
        }
      } catch(e) {}

      try {
        const { getFirestorePosts } = await import("./src/services/blogService");
        const posts = await getFirestorePosts();
        for(const post of posts) {
          res.write('  <url>\n');
          res.write(`    <loc>${baseUrl}/blog/${post.id}</loc>\n`);
          res.write('    <changefreq>weekly</changefreq>\n');
          res.write('    <priority>0.7</priority>\n');
          res.write('  </url>\n');
        }
      } catch(e) {}

      res.write('</urlset>\n');
      res.end();
    } catch (error) {
      console.error("Sitemap error:", error);
      res.status(500).end();
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
