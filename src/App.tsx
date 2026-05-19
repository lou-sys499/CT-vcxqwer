/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { Category } from './pages/Category';
import { ProductDetail } from './pages/ProductDetail';
import { Blog } from './pages/Blog';
import { BlogPostPage } from './pages/BlogPost';
import { About } from './pages/About';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Admin } from './pages/Admin';
import { Search } from './pages/Search';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { RefundPolicy } from './pages/RefundPolicy';
import { PrivacyPolicy } from './pages/Privacy';
import { TermsOfService } from './pages/Terms';
import { Sitemap } from './pages/Sitemap';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow bg-[#F9FAFB]">
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
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

