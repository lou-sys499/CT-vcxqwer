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
  const defaultDesc = "Discover premium cordless power tools, high-efficiency battery vacuums, and heavy-duty gear at CordlessToolz. Engineered with rigor for professionals.";
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

  let formattedTitle = params.title || defaultTitle;
  if (params.title) {
    if (params.title.includes(siteName)) {
      formattedTitle = params.title;
    } else {
      formattedTitle = `${params.title} | ${siteName}`;
    }
  }

  // Safe truncation for SEO Title Length (optimal Yoast limit is 60 chars)
  if (formattedTitle.length > 60) {
    const suffix = ` | ${siteName}`;
    if (formattedTitle.endsWith(suffix) && params.title) {
      const allowedLength = 60 - suffix.length - 3;
      if (allowedLength > 5) {
        const trimmedMain = params.title.slice(0, allowedLength) + "...";
        formattedTitle = `${trimmedMain}${suffix}`;
      } else {
        formattedTitle = formattedTitle.slice(0, 57) + "...";
      }
    } else {
      formattedTitle = formattedTitle.slice(0, 57) + "...";
    }
  }

  let formattedDesc = params.description || defaultDesc;
  
  // Ensure the description is always between 120 and 160 characters for Yoast compatibility
  if (formattedDesc.length < 120) {
    const filler = " Get standard lifetime warranties, express shipping, and expert advice at CordlessToolz on all premium cordless equipment purchases today.";
    formattedDesc = (formattedDesc + filler).slice(0, 155);
    if (formattedDesc.length < 120) {
      formattedDesc = formattedDesc.padEnd(120, '.');
    }
  } else if (formattedDesc.length > 160) {
    formattedDesc = formattedDesc.slice(0, 157) + "...";
  }

  return {
    title: formattedTitle,
    description: formattedDesc,
    canonicalUrl,
    keywords: params.keywords ? params.keywords.join(", ") : undefined,
    ogImage: params.ogImage || defaultOgImage,
    ogType: params.ogType || 'website',
  };
}
