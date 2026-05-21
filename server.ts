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

  // Sitemap route
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = process.env.APP_URL || `https://${req.get('host')}`;
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

      // Read firebase-applet-config.json
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      const fs = await import('fs/promises');
      let fbConfig;
      try {
        const configStr = await fs.readFile(configPath, 'utf8');
        fbConfig = JSON.parse(configStr);
      } catch (e) {
        console.warn("Could not load firebase config for sitemap", e);
      }

      if (fbConfig && fbConfig.projectId) {
        const projectId = fbConfig.projectId;
        const databaseId = fbConfig.firestoreDatabaseId || '(default)';

        // Fetch products
        try {
          const productsUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/products?pageSize=1000`;
          const productsRes = await fetch(productsUrl);
          if (productsRes.ok) {
            const productsData = await productsRes.json();
            if (productsData.documents) {
              for (const doc of productsData.documents) {
                // Document name is like: projects/.../databases/.../documents/products/1234
                const id = doc.name.split('/').pop();
                res.write('  <url>\n');
                res.write(`    <loc>${baseUrl}/product/${id}</loc>\n`);
                res.write('    <changefreq>daily</changefreq>\n');
                res.write('    <priority>0.9</priority>\n');
                res.write('  </url>\n');
              }
            }
          }
        } catch (e) { console.warn("Failed fetching products for sitemap", e); }

        // Fetch categories
        try {
          const catUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/categories?pageSize=100`;
          const catRes = await fetch(catUrl);
          if (catRes.ok) {
            const catData = await catRes.json();
            if (catData.documents) {
              for (const doc of catData.documents) {
                // The document ID is not necessarily the slug. But let's check what ID is used in the app routing.
                // The route expects /category/:slug. Let's see if we have slug in the document fields. 
                const fields = doc.fields || {};
                const slug = fields.slug?.stringValue || doc.name.split('/').pop();
                
                res.write('  <url>\n');
                res.write(`    <loc>${baseUrl}/category/${slug}</loc>\n`);
                res.write('    <changefreq>weekly</changefreq>\n');
                res.write('    <priority>0.8</priority>\n');
                res.write('  </url>\n');
              }
            }
          }
        } catch (e) { console.warn("Failed fetching categories for sitemap", e); }

        // Fetch blog posts
        try {
          const blogUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/blogPosts?pageSize=100`;
          const blogRes = await fetch(blogUrl);
          if (blogRes.ok) {
            const blogData = await blogRes.json();
            if (blogData.documents) {
              for (const doc of blogData.documents) {
                const id = doc.name.split('/').pop();
                res.write('  <url>\n');
                res.write(`    <loc>${baseUrl}/blog/${id}</loc>\n`);
                res.write('    <changefreq>weekly</changefreq>\n');
                res.write('    <priority>0.7</priority>\n');
                res.write('  </url>\n');
              }
            }
          }
        } catch (e) { console.warn("Failed fetching blog posts for sitemap", e); }
      }

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
