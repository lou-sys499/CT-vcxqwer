import fs from 'fs';
import path from 'path';
import { getFirestoreProducts, getFirestoreCategories } from '../src/services/productService.ts';
import { getBlogPosts } from '../src/services/blogService.ts';

const SITE_URL = 'https://cordlesstoolz.com';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getProductUrl(product: { id: string; name: string; brand?: string }): string {
  const brandPart = product.brand && product.brand.toLowerCase() !== 'generic' ? `${product.brand}-` : '';
  const cleanSlug = slugify(`${brandPart}${product.name}`);
  return `/product/${product.id}/${cleanSlug}`;
}

function getBlogPostUrl(post: { id: string; title: string }): string {
  const cleanSlug = slugify(post.title);
  return `/blog/${post.id}/${cleanSlug}`;
}

async function run() {
  try {
    console.log("🚀 Pre-generating all sitemaps dynamically...");

    // 1. Pages Sitemap
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

    let pagesXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const route of staticRoutes) {
      pagesXml += `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
    pagesXml += `</urlset>\n`;

    // 2. Categories Sitemap
    let categoriesXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    const categories = await getFirestoreCategories();
    for (const cat of categories) {
      const slug = cat.slug || cat.id;
      categoriesXml += `  <url>\n    <loc>${SITE_URL}/category/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
    categoriesXml += `</urlset>\n`;

    // 3. Products Sitemap
    let productsXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    const products = await getFirestoreProducts();
    for (const p of products) {
      const pathSuffix = getProductUrl(p);
      productsXml += `  <url>\n    <loc>${SITE_URL}${pathSuffix}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    }
    productsXml += `</urlset>\n`;

    // 4. Blog Sitemap
    let blogXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    const posts = await getBlogPosts();
    for (const post of posts) {
      const pathSuffix = getBlogPostUrl(post);
      blogXml += `  <url>\n    <loc>${SITE_URL}${pathSuffix}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }
    blogXml += `</urlset>\n`;

    // 5. Sitemap Index
    const sitemaps = [
      '/sitemap-pages.xml',
      '/sitemap-categories.xml',
      '/sitemap-products.xml',
      '/sitemap-blog.xml'
    ];
    let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const sm of sitemaps) {
      indexXml += `  <sitemap>\n    <loc>${SITE_URL}${sm}</loc>\n  </sitemap>\n`;
    }
    indexXml += `</sitemapindex>\n`;

    // Ensure public dir exists
    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write all sitemaps
    fs.writeFileSync(path.join(publicDir, 'sitemap-pages.xml'), pagesXml);
    fs.writeFileSync(path.join(publicDir, 'sitemap-categories.xml'), categoriesXml);
    fs.writeFileSync(path.join(publicDir, 'sitemap-products.xml'), productsXml);
    fs.writeFileSync(path.join(publicDir, 'sitemap-blog.xml'), blogXml);
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml);

    console.log("✅ All five sitemap files generated successfully in /public !");

    // Write robots.txt as well
    const robotsContent = `User-agent: *
Allow: /
Disallow: /checkout
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml
`;
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent);
    console.log("✅ robots.txt generated successfully in /public !");

  } catch (err) {
    console.error("❌ Error generating sitemaps at build-time:", err);
  } finally {
    process.exit(0);
  }
}

run();
