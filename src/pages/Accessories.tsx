import React from 'react';
import { SEO } from '../components/SEO';

export function Accessories() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <SEO 
        title="Tool Accessories | Upgrade Your Gear" 
        description="Find the best tool accessories for your cordless power tools."
      />
      <h1 className="text-4xl font-black text-slate-900 mb-6">Tool Accessories</h1>
      <p className="text-xl text-slate-600 mb-8">Coming Soon: Batteries, chargers, bits, and blades to keep your tools running at peak performance.</p>
    </div>
  );
}
