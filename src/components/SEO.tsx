import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
}

export function SEO({ title, description, url }: SEOProps) {
  const defaultTitle = "CordlessToolz | Professional Cordless Power Tools & Equipment";
  const defaultDesc = "CordlessToolz provides professional-grade, high-performance cordless power tools for contractors and DIY enthusiasts.";
  
  // Always use the primary domain for the canonical URL
  const baseUrl = "https://cordlesstoolz.com";
  // Determine path safely whether we are passed a full URL, relative path, or falling back to window location
  let currentPath = "/";
  if (url) {
    try {
      if (url.startsWith('http')) {
        currentPath = new URL(url).pathname;
      } else {
        currentPath = url.split('?')[0];
      }
    } catch(e) {}
  } else if (typeof window !== 'undefined') {
    currentPath = window.location.pathname;
  }

  // Remove trailing slashes
  if (currentPath !== '/' && currentPath.endsWith('/')) {
    currentPath = currentPath.slice(0, -1);
  }

  const canonicalUrl = `${baseUrl}${currentPath}`;

  return (
    <Helmet>
      <title>{title ? `${title} | CordlessToolz` : defaultTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
