import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductUI';
import { getFirestoreProducts } from '../services/productService';
import { Product } from '../types';
import { PRODUCTS } from '../data';
import { SEO } from '../components/SEO';
import { LEGACY_PRODUCTS_MAPPING } from '../utils/legacyProducts';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        // Fetch products for all categories or generic product fetch
        const fbProducts = await getFirestoreProducts();
        
        const combined = [...fbProducts, ...PRODUCTS];
        const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());
        
        setAllProducts(unique);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const searchResults = React.useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase().trim();
    
    // Find official IDs that match the search query via legacy aliases
    const matchedOfficialIds = new Set<string>();
    LEGACY_PRODUCTS_MAPPING.forEach(mapping => {
      const isMatch = mapping.legacyNames.some(name => 
        lowerQuery.includes(name) || name.includes(lowerQuery)
      ) || mapping.legacyId.toLowerCase().includes(lowerQuery);
      
      if (isMatch) {
        matchedOfficialIds.add(mapping.officialId);
      }
    });

    return allProducts.filter(p => {
      if (!p || !p.name) return false;
      return (
        matchedOfficialIds.has(p.id) ||
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery) || 
        p.brand.toLowerCase().includes(lowerQuery) ||
        (p.category && p.category.toLowerCase().includes(lowerQuery))
      );
    });
  }, [allProducts, query]);

  if (loading) {
    return (
      <div className="pt-24 pb-12 min-h-[60vh] flex items-center justify-center">
        <div className="text-xl font-bold text-slate-400">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title={`Search results for "${query}" | CordlessToolz`}
        description={`Browse complete inventory matches and find detailed specifications for "${query}" on CordlessToolz. High-grade tools, vacuums, and professional accessories.`} 
      />
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Search Results</h1>
        <p className="text-slate-500">
          {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "<span className="text-slate-900 font-bold">{query}</span>"
        </p>
      </div>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map(product => (
             <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl premium-shadow">
          <p className="text-slate-500 text-lg">No products found matching your search. Try different keywords.</p>
        </div>
      )}
    </div>
  );
}
