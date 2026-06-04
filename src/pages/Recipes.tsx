import React from 'react';
import { SEO } from '../components/SEO';

export function Recipes() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <SEO 
        title="DIY Project Recipes & Modification Guides" 
        description="Learn how to build, create, and modify with our DIY project recipes."
      />
      <h1 className="text-4xl font-black text-slate-900 mb-6">DIY Project Recipes</h1>
      <p className="text-xl text-slate-600 mb-8">Coming Soon: Step-by-step instructions, modification guides, and 'recipes' for your next big build.</p>
    </div>
  );
}
