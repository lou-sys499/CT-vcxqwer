import fs from 'fs';
import path from 'path';

// Define your static and dynamic routes here
const routes = [
  '/',
  '/about',
  '/blog',
  '/contact',
  '/shipping-policy',
  '/refund-policy',
  '/privacy',
  '/terms',
  '/category/power-tools',
  '/category/hand-tools',
  '/category/accessories',
  '/vacuums',
  '/tool-accessories',
  '/recipes',
];

const SITE_URL = 'https://cordlesstoolz.com';

function generateSitemap() {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  // Ensure public directory exists
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write sitemap.xml
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log(`✅ Sitemap successfully generated at ${sitemapPath}`);

  // Write robots.txt as well
  const robotsContent = `User-agent: *
Disallow: /admin/
Disallow: /dashboard/
Disallow: /checkout/

Sitemap: ${SITE_URL}/sitemap.xml
`;
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent);
  console.log(`✅ Robots.txt successfully generated at ${robotsPath}`);
}

generateSitemap();
