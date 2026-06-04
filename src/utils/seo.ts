export interface SeoConfigParams {
  title?: string;
  description?: string;
  url?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
}

export function generateSeoConfig(params: SeoConfigParams) {
  const siteName = "CordlessToolz";
  const defaultTitle = `${siteName} | Professional Cordless Power Tools & Equipment`;
  const defaultDesc = "CordlessToolz provides professional-grade, high-performance cordless power tools for contractors and DIY enthusiasts.";
  const defaultOgImage = "https://cordlesstoolz.com/og-image.jpg";
  const baseUrl = "https://cordlesstoolz.com";

  // Determine path safely
  let currentPath = "/";
  if (params.url) {
    try {
      if (params.url.startsWith('http')) {
        currentPath = new URL(params.url).pathname;
      } else {
        currentPath = params.url.split('?')[0];
      }
    } catch(e) {}
  } else if (typeof window !== 'undefined') {
    currentPath = window.location.pathname;
  }

  // Remove trailing slashes (unless it's the root path)
  if (currentPath !== '/' && currentPath.endsWith('/')) {
    currentPath = currentPath.slice(0, -1);
  }

  const canonicalUrl = `${baseUrl}${currentPath}`;

  const formattedTitle = params.title 
    ? `${params.title} | ${siteName}` 
    : defaultTitle;

  return {
    title: formattedTitle,
    description: params.description || defaultDesc,
    canonicalUrl,
    keywords: params.keywords ? params.keywords.join(", ") : undefined,
    ogImage: params.ogImage || defaultOgImage,
    ogType: params.ogType || 'website',
  };
}
