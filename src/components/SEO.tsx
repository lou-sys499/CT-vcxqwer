import { Helmet } from 'react-helmet-async';
import { generateSeoConfig } from '../utils/seo';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  schema?: Record<string, any> | Record<string, any>[];
  noindex?: boolean;
}

export function SEO({ 
  title, 
  description, 
  url, 
  keywords, 
  ogImage, 
  ogType = 'website',
  schema,
  noindex = false
}: SEOProps) {
  const location = useLocation();
  const resolvedUrl = url || location.pathname;
  const seoConfig = generateSeoConfig({ title, description, url: resolvedUrl, keywords, ogImage, ogType });

  // Default Organization Schema
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CordlessToolz",
    "url": "https://cordlesstoolz.com",
    "logo": "https://cordlesstoolz.com/logo.png"
  };

  const finalSchema = schema 
    ? (Array.isArray(schema) ? [defaultSchema, ...schema] : [defaultSchema, schema])
    : [defaultSchema];

  return (
    <Helmet>
      <title>{seoConfig.title}</title>
      <meta name="description" content={seoConfig.description} />
      {seoConfig.keywords && <meta name="keywords" content={seoConfig.keywords} />}
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoConfig.canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seoConfig.ogType} />
      <meta property="og:url" content={seoConfig.canonicalUrl} />
      <meta property="og:title" content={seoConfig.title} />
      <meta property="og:description" content={seoConfig.description} />
      {seoConfig.ogImage && <meta property="og:image" content={seoConfig.ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoConfig.canonicalUrl} />
      <meta name="twitter:title" content={seoConfig.title} />
      <meta name="twitter:description" content={seoConfig.description} />
      {seoConfig.ogImage && <meta name="twitter:image" content={seoConfig.ogImage} />}
      
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
}
