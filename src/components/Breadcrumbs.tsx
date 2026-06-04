import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export interface BreadcrumbsProps {
  items: { name: string; url: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cordlesstoolz.com';

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${currentUrl}${item.url}`
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="mb-6 overflow-x-auto">
        <ol className="flex items-center gap-2 text-sm text-slate-500 whitespace-nowrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.url} className="flex items-center gap-2">
                {isLast ? (
                  <span className="font-semibold text-slate-900" aria-current="page">{item.name}</span>
                ) : (
                  <>
                    <NavLink to={item.url} className="hover:text-orange-600 transition-colors">
                      {item.name}
                    </NavLink>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
