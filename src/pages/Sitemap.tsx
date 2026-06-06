import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Globe, ShoppingBag, BookOpen, Shield, ShieldAlert } from 'lucide-react';
import { SEO } from '../components/SEO';
import { getProductUrl, getBlogPostUrl } from '../utils/seo';
import { getFirestoreProducts, getFirestoreCategories } from '../services/productService';
import { getBlogPosts } from '../services/blogService';
import { Product, Category, BlogPost } from '../types';

export function Sitemap() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods, posts] = await Promise.all([
          getFirestoreCategories(),
          getFirestoreProducts(),
          getBlogPosts()
        ]);
        setCategories(cats || []);
        setProducts(prods || []);
        setBlogPosts(posts || []);
      } catch (err) {
        console.error("Error generating dynamic sitemap resources:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
      <SEO 
        title="Sitemap Directory | CordlessToolz"
        description="Comprehensive store map for CordlessToolz. Navigate buying guides, contractor tools, hardware reviews, and help policies." 
      />
      
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Store Sitemap Directory
        </h1>
        <p className="text-lg text-slate-600">
          A fully indexed layout of our product departments, specialized help resources, and industrial buyer guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* SHOPPING SECTOR */}
        <div className="bg-white p-8 rounded-[2rem] premium-shadow border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Catalogs & Departments</h2>
            </div>
            
            <ul className="space-y-4">
              <li>
                <NavLink to="/" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Browse Professional Cordless Tools Catalog</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/category/cordless-vacuums" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Shop High-Efficiency Battery Vacuums Collection</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/category/power-tools" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Explore Rugged Contractor Power Tools</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/vacuums" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Research Vacuum Engineering & Airflow Details</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/tool-accessories" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Upgrade Specialized Gear & Accessories</span>
                </NavLink>
              </li>
              
              {categories.map((cat) => (
                <li key={cat.id}>
                  <NavLink to={`/category/${cat.slug}`} className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                    <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    <span>Explore our specialized {cat.name} department</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* GUIDES & EDITORIALS */}
        <div className="bg-white p-8 rounded-[2rem] premium-shadow border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">DIY Guides & Reviews</h2>
            </div>
            
            <ul className="space-y-4">
              <li>
                <NavLink to="/blog" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Browse Professional Buying Recommendations</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/recipes" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Build with DIY Project Modification Recipes</span>
                </NavLink>
              </li>
              
              {blogPosts.slice(0, 5).map((post) => (
                <li key={post.id || post.title}>
                  <NavLink to={getBlogPostUrl(post)} className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                    <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    <span>Read expert analysis of {post.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CUSTOMER CARE & SECURE FLOWS */}
        <div className="bg-white p-8 rounded-[2rem] premium-shadow border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Policies & Procurement</h2>
            </div>
            
            <ul className="space-y-4">
              <li>
                <NavLink to="/checkout" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Initiate Secure Billing and Checkout Terminal</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/order-success" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Verify Order Accomplishment Status</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/shipping-policy" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Review Shipping Speed & Processing Rates</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/refund-policy" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Examine 90-Day Return & Refund Guarantees</span>
                </NavLink>
              </li>
              <li>
                <a href="mailto:support@cordlesstoolz.com" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Contact Support Staff Directly</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* TRANSPARENCY & ADMIN */}
        <div className="bg-white p-8 rounded-[2rem] premium-shadow border border-slate-100 lg:col-span-3">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Corporate Safeguards & Directory Mapping</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ul className="space-y-4">
              <li>
                <NavLink to="/about" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Explore Customer Centered Values & Core Story</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/search" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Search the Complete Inventory Directory</span>
                </NavLink>
              </li>
            </ul>
            <ul className="space-y-4">
              <li>
                <NavLink to="/privacy" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Review Digital Privacy Safeguards & Cookies</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/terms" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Terms of Service and Customer Obligations</span>
                </NavLink>
              </li>
            </ul>
            <ul className="space-y-4">
              <li>
                <NavLink to="/sitemap" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Navigate Complete Sitemap Directory</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin" className="flex items-start text-slate-600 hover:text-orange-600 transition-colors font-medium group text-sm">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  <span>Authorized Personnel Command Control Center</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* DYNAMIC PRODUCT INVENTORY CATALOGUE */}
        {products.length > 0 && (
          <div className="bg-white p-8 rounded-[2rem] premium-shadow border border-slate-100 lg:col-span-3">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                <ShoppingBag className="w-6 h-6" />
              </span>
              Product Inventory Direct Deep Links ({products.length} Items)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <NavLink 
                  key={prod.id} 
                  to={getProductUrl(prod)}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-orange-500 hover:bg-orange-50/10 transition-all font-medium text-xs text-slate-600 hover:text-orange-600 flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  <span className="truncate">Buy {prod.brand || 'Original'} {prod.name} with Specs</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
