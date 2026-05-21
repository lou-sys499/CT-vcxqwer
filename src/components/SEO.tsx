import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
}

export function SEO({ title, description, url }: SEOProps) {
  const defaultTitle = "CordlessToolz | Professional Cordless Power Tools & Equipment";
  const defaultDesc = "CordlessToolz provides professional-grade, high-performance cordless power tools for contractors and DIY enthusiasts.";
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : "https://cordlesstoolz.com");

  return (
    <Helmet>
      <title>{title ? `${title} | CordlessToolz` : defaultTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
