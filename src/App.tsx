/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar, Footer } from './components/Layout';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SEO } from './components/SEO';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Category = lazy(() => import('./pages/Category').then(m => ({ default: m.Category })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogPostPage = lazy(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPostPage })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess').then(m => ({ default: m.OrderSuccess })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const Search = lazy(() => import('./pages/Search').then(m => ({ default: m.Search })));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy').then(m => ({ default: m.ShippingPolicy })));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy').then(m => ({ default: m.RefundPolicy })));
const PrivacyPolicy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/Terms').then(m => ({ default: m.TermsOfService })));
const Sitemap = lazy(() => import('./pages/Sitemap').then(m => ({ default: m.Sitemap })));
const Vacuums = lazy(() => import('./pages/Vacuums').then(m => ({ default: m.Vacuums })));
const Accessories = lazy(() => import('./pages/Accessories').then(m => ({ default: m.Accessories })));
const Recipes = lazy(() => import('./pages/Recipes').then(m => ({ default: m.Recipes })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return <SEO url={typeof window !== 'undefined' ? window.location.href.split('?')[0] : ''} />;
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow bg-[#F9FAFB]">
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:slug" element={<Category />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogPostPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/sitemap" element={<Sitemap />} />
                    <Route path="/vacuums" element={<Vacuums />} />
                    <Route path="/tool-accessories" element={<Accessories />} />
                    <Route path="/recipes" element={<Recipes />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

