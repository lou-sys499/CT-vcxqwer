import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

import compression from "compression";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Set X-Robots-Tag header to ensure indexing
  app.use((req, res, next) => {
    res.setHeader('X-Robots-Tag', 'index, follow');
    next();
  });

  app.use(compression());
  app.use(express.json());

  // Email route (SMTP Mailtrap)
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, text } = req.body;
    
    if (!to || !subject || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    try {
      const { MailtrapClient } = await import("mailtrap");
      // Use the provided token or fallback to environment variable
      const TOKEN = process.env.MAILTRAP_TOKEN || "3bdb21554f9009462366d0c447b7d198";
      
      const client = new MailtrapClient({ token: TOKEN });
      
      const sender = {
        email: "support@cordlesstoolz.com",
        name: "Mailtrap Test",
      };
      
      // Support array of emails or single email string
      const recipientsList = Array.isArray(to) ? to : [to];
      const recipients = recipientsList.map(email => ({ email }));

      await client.send({
        from: sender,
        to: recipients,
        subject: subject,
        text: text,
        category: "Order Notification",
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

  // Sitemap index route
  app.get("/sitemap.xml", (req, res) => {
    try {
      const baseUrl = process.env.CUSTOM_DOMAIN || `https://cordlesstoolz.com`;
      res.setHeader("Content-Type", "application/xml");
      res.write('<?xml version="1.0" encoding="UTF-8"?>\n');
      res.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');
      
      const sitemaps = [
        '/sitemap-pages.xml',
        '/sitemap-categories.xml',
        '/sitemap-products.xml',
        '/sitemap-blog.xml'
      ];

      for (const sm of sitemaps) {
        res.write('  <sitemap>\n');
        res.write(`    <loc>${baseUrl}${sm}</loc>\n`);
        res.write('  </sitemap>\n');
      }

      res.write('</sitemapindex>\n');
      res.end();
    } catch (error) {
      console.error("Sitemap index error:", error);
      res.status(500).end();
    }
  });

  // Sitemap - Pages
  app.get("/sitemap-pages.xml", (req, res) => {
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
        '/sitemap',
        '/vacuums',
        '/tool-accessories',
        '/recipes'
      ];

      res.setHeader("Content-Type", "application/xml");
      res.write('<?xml version="1.0" encoding="UTF-8"?>\n');
      res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

      for (const route of staticRoutes) {
        res.write('  <url>\n');
        res.write(`    <loc>${baseUrl}${route}</loc>\n`);
        res.write('    <changefreq>weekly</changefreq>\n');
        res.write('    <priority>0.8</priority>\n');
        res.write('  </url>\n');
      }

      res.write('</urlset>\n');
      res.end();
    } catch (e) {
      res.status(500).end();
    }
  });

  // Sitemap - Categories
  app.get("/sitemap-categories.xml", async (req, res) => {
    try {
      const baseUrl = process.env.CUSTOM_DOMAIN || `https://cordlesstoolz.com`;
      res.setHeader("Content-Type", "application/xml");
      res.write('<?xml version="1.0" encoding="UTF-8"?>\n');
      res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

      try {
        const { getFirestoreCategories } = await import("./src/services/productService");
        const categories = await getFirestoreCategories();
        for (const cat of categories) {
           res.write('  <url>\n');
           res.write(`    <loc>${baseUrl}/category/${cat.slug || cat.id}</loc>\n`);
           res.write('    <changefreq>weekly</changefreq>\n');
           res.write('    <priority>0.8</priority>\n');
           res.write('  </url>\n');
        }
      } catch (e) {
        console.warn("Error fetching categories for sitemap", e);
      }

      res.write('</urlset>\n');
      res.end();
    } catch (e) {
      res.status(500).end();
    }
  });

  // Sitemap - Products
  app.get("/sitemap-products.xml", async (req, res) => {
    try {
      const baseUrl = process.env.CUSTOM_DOMAIN || `https://cordlesstoolz.com`;
      res.setHeader("Content-Type", "application/xml");
      res.write('<?xml version="1.0" encoding="UTF-8"?>\n');
      res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

      try {
        const { getFirestoreProducts } = await import("./src/services/productService");
        const { getProductUrl } = await import("./src/utils/seo");
        const productsData = await getFirestoreProducts();
        for (const p of productsData) {
          const urlPath = getProductUrl(p);
          res.write('  <url>\n');
          res.write(`    <loc>${baseUrl}${urlPath}</loc>\n`);
          res.write('    <changefreq>daily</changefreq>\n');
          res.write('    <priority>0.9</priority>\n');
          res.write('  </url>\n');
        }
      } catch (e) {
        console.warn("Failed fetching products for sitemap", e);
      }

      res.write('</urlset>\n');
      res.end();
    } catch (e) {
      res.status(500).end();
    }
  });

  // Sitemap - Blog
  app.get("/sitemap-blog.xml", async (req, res) => {
    try {
      const baseUrl = process.env.CUSTOM_DOMAIN || `https://cordlesstoolz.com`;
      res.setHeader("Content-Type", "application/xml");
      res.write('<?xml version="1.0" encoding="UTF-8"?>\n');
      res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

      try {
        const { getBlogPosts } = await import("./src/services/blogService");
        const { getBlogPostUrl } = await import("./src/utils/seo");
        const posts = await getBlogPosts();
        for (const post of posts) {
          const urlPath = getBlogPostUrl(post);
          res.write('  <url>\n');
          res.write(`    <loc>${baseUrl}${urlPath}</loc>\n`);
          res.write('    <changefreq>weekly</changefreq>\n');
          res.write('    <priority>0.7</priority>\n');
          res.write('  </url>\n');
        }
      } catch (e) {
        console.warn("Failed fetching blog posts for sitemap", e);
      }

      res.write('</urlset>\n');
      res.end();
    } catch (e) {
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
    const fs = await import('fs/promises');
    app.use(express.static(distPath, { index: false }));
    app.get('*', async (req, res) => {
      try {
        let html = await fs.readFile(path.join(distPath, 'index.html'), 'utf-8');
        const baseUrl = process.env.CUSTOM_DOMAIN || 'https://cordlesstoolz.com';
        let currentPath = req.path || '/';
        currentPath = currentPath.split('?')[0];
        if (currentPath !== '/' && currentPath.endsWith('/')) {
           currentPath = currentPath.slice(0, -1);
        }
        const canonicalUrl = `${baseUrl}${currentPath}`;
        const seoTags = `
        <meta name="robots" content="index, follow" data-rh="true" />
        <link rel="canonical" href="${canonicalUrl}" data-rh="true" />
        `;
        html = html.replace('</head>', `${seoTags}</head>`);
        res.send(html);
      } catch (e) {
        res.status(500).send('Server Error');
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
