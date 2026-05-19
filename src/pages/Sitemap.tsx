import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '../components/SEO';

export function Sitemap() {
  const sections = [
    {
      title: "Shop",
      links: [
        { label: "All Products", path: "/" },
        { label: "Cordless Vacuums", path: "/category/cordless-vacuums" },
        { label: "Power Tools", path: "/category/power-tools" },
      ]
    },
    {
      title: "Information",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Contact Support", path: "#" },
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Articles & Blog", path: "/blog" },
        { label: "Buying Guides", path: "/blog" },
        { label: "Field Reviews", path: "/blog" },
      ]
    },
    {
      title: "Legal & Policies",
      links: [
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Terms of Service", path: "/terms" },
        { label: "Shipping Policy", path: "/shipping-policy" },
        { label: "Refund Policy", path: "/refund-policy" },
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
      <SEO 
        title="Sitemap | CordlessToolz"
        description="Navigate the CordlessToolz website with our complete sitemap. Find products, guides, and policies easily." 
      />
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Sitemap</h1>
        <p className="text-lg text-slate-600">Navigate our website</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl premium-shadow border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{section.title}</h2>
            <ul className="space-y-4">
              {section.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <NavLink 
                    to={link.path} 
                    className="flex items-center text-slate-600 hover:text-orange-600 transition-colors font-medium group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
