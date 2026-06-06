import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Trophy, Shield, ChevronRight, Star } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data';
import { ProductCard, TrustBar } from '../components/ProductUI';
import { getFirestoreProducts } from '../services/productService';
import { Product, Category } from '../types';
import { SEO } from '../components/SEO';
import { getProductUrl } from '../utils/seo';

export function Home() {
  const [allProducts, setAllProducts] = React.useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = React.useState<Category[]>(CATEGORIES);

  React.useEffect(() => {
    const fetchData = async () => {
      // Products
      const fbProducts = await getFirestoreProducts();
      if (fbProducts.length > 0) {
        setAllProducts(prev => {
          const combined = [...prev, ...fbProducts];
          return Array.from(new Map(combined.map(p => [p.id, p])).values());
        });
      }

      // Categories
      const fbCats = await import('../services/productService').then(m => m.getFirestoreCategories());
      setCategories(prev => {
        const combined = [...prev, ...fbCats].filter(Boolean);
        return Array.from(new Map(combined.map(c => [c.id, c])).values());
      });
    };
    fetchData();
  }, []);

  const topSmotureProduct = React.useMemo(() => {
    return allProducts
      .filter(p => p.brand.toLowerCase() === 'smoture')
      .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0) || b.rating - a.rating)
      [0];
  }, [allProducts]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://cordlesstoolz.com/"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the best cordless power tools for contractors?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best cordless power tools for contractors feature brushless motors, high-capacity lithium-ion batteries, and heavy-duty build quality. Leading brands include DeWalt, Makita, and Milwaukee."
        }
      },
      {
        "@type": "Question",
        "name": "How long do cordless tool batteries last?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cordless tool batteries typically last between 3 to 5 years, or roughly 1,000 charge cycles, depending on usage intensity and charging habits."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use the same battery for different cordless tools?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, if the tools are from the same brand and share the same battery platform (e.g., 18V or 20V MAX). Always check manufacturer compatibility before swapping."
        }
      }
    ]
  };

  return (
    <div className="space-y-24 pb-24">
      <SEO 
        title="CordlessToolz | Professional Cordless Power Tools & Equipment"
        description="Discover professional-grade cordless power tools, high-capacity vacuums, and robust contractor accessories for your next workshop build at CordlessToolz." 
        schema={[breadcrumbSchema, faqSchema]}
      />
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-48 pb-16 lg:pb-32 overflow-hidden text-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center justify-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-extra-bold uppercase tracking-widest mb-6">
                <Zap className="w-4 h-4" /> 2026 Home & Workshop Gear
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-8 text-balance mx-auto">
                Shop Cordless Power Tools, Vacuums & Tool Accessories Online
              </h1>
              <div className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-10 space-y-4">
                <p>
                  Welcome to CordlessToolz, your premier destination to shop cordless power tools, vacuums, and tool accessories online. Whether you are a seasoned contractor looking for reliable <NavLink to="/category/power-tools" className="text-orange-600 hover:underline">Cordless Power Tools</NavLink>, or a DIY enthusiast enhancing your home workshop, we provide an extensive, expert-curated selection. 
                </p>
                <p>
                  Browse high-performance drills, heavy-duty saws, and smart <NavLink to="/vacuums" className="text-orange-600 hover:underline">Cordless Vacuums</NavLink> designed to keep your workspace pristine. Upgrade your toolkit today with the top <NavLink to="/tool-accessories" className="text-orange-600 hover:underline">Tool Accessories</NavLink>, read our <NavLink to="/recipes" className="text-orange-600 hover:underline">DIY Project Recipes</NavLink>, and always remember to follow proper <a href="https://www.osha.gov/hand-power-tools" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Tool safety guidelines</a>.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavLink to="/category/power-tools" className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-orange-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  Shop All Power Tools Now <ArrowRight className="w-5 h-5" />
                </NavLink>
                <NavLink to="/blog" className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  Read Reviews <ChevronRight className="w-5 h-5" />
                </NavLink>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Image / Background Element */}
        <div className="absolute inset-0 w-full h-full -z-10 opacity-20">
           {/* In a real project, use a high quality transparent tool image */}
           <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.15),transparent_60%)] relative">
              <motion.img 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=1200&fm=webp" 
                alt="Cordless power tools and accessories for professional contractors" 
                className="w-full h-full object-cover object-center scale-x-[-1]"
                loading="eager"
                decoding="sync"
                // @ts-ignore - React 18 supports fetchpriority but types might not
                fetchPriority="high"
                width="1200"
                height="800"
              />
           </div>
        </div>
      </section>

      {/* TOP PICKS Section - Requirement 2 */}
      {topSmotureProduct && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
          <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative border border-white/10">
            <div className="absolute top-0 right-0 p-8">
               <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                 Most Popular Choice
               </span>
            </div>
            
            <div className="grid lg:grid-cols-2 items-center">
              <div className="p-6 sm:p-12 lg:p-20">
                <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-4 block">Top Picks</span>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6 md:mb-8">
                  The <span className="text-orange-600">Smoture</span> Mastery Item.
                </h2>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{topSmotureProduct.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 text-orange-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(topSmotureProduct.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-slate-400 text-sm">({Math.floor(Math.random() * 9) + 1} reviews)</span>
                  </div>
                  {/* Product description removed per requirement */}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-3xl font-black text-white">${topSmotureProduct.price}</div>
                  <NavLink 
                    to={getProductUrl(topSmotureProduct)}
                    className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center gap-2"
                  >
                    View Details <ArrowRight className="w-5 h-5" />
                  </NavLink>
                </div>
              </div>
              <div className="relative h-full min-h-[400px]">
                <img 
                  loading="lazy"
                  decoding="async"
                  src={topSmotureProduct.images[0]} 
                  alt={topSmotureProduct.name}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                  width="600"
                  height="450"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent lg:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:hidden block" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 text-center pt-10">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight text-center">Professional Cordless Power Tools</h2>
          <h3 className="text-orange-600 font-bold uppercase tracking-widest text-sm mt-4 block text-center">Tool Accessories for Every Job</h3>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat, i) => (
            <NavLink
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] min-w-[260px] max-w-[320px] block"
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer"
              >
                <img loading="lazy" decoding="async" src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Premium high-performance ${cat.name.toLowerCase()} cordless power tools and accessories`} width="300" height="256" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-6 flex flex-col justify-end items-center text-center">
                  <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-xs text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{cat.description}</p>
                </div>
              </motion.div>
            </NavLink>
          ))}
        </div>
      </section>

      {/* Trust & Best Sellers */}
      <section id="top-picks" className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <TrustBar />
          
          <div className="mt-24">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-extra-bold uppercase tracking-widest mb-4 shadow-sm">
                <Trophy className="w-4 h-4 text-orange-500" /> Most Wanted Gear
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Top Picks This Week</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Selected by our master craftsmen based on precision, battery life, and raw power output.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...allProducts].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-16 text-center">
              <NavLink to="/category/power-tools" className="inline-block bg-slate-900 text-white px-10 py-4 rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-all">
                Shop Full Catalog
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* News/Blog Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 bg-white rounded-[3rem] py-24 shadow-2xl shadow-orange-900/5 border border-slate-100 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-orange-600/5 blur-[100px] rounded-full" />
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Zap className="w-12 h-12 text-orange-600 mb-6" />
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter mb-6 md:mb-8">
              Smart Cordless Vacuums for Home & Workspace
            </h2>
            <p className="text-lg text-slate-600 mb-10 text-balance">
              Stay ahead with the latest tool tech deep-dives, field tests, and professional guides. Whether you're on a jobsite or in your home workshop, we provide the knowledge you need on heavy-duty equipment.
            </p>
            <ul className="space-y-4 mb-10">
              {['New gear deep-dives', 'Maintenance guides', 'Industry news & updates'].map((item) => (
                <li key={item} className="flex items-center gap-3 font-semibold text-slate-700">
                  <div className="bg-orange-100 p-1 rounded-full"><ChevronRight className="w-4 h-4 text-orange-600" /></div>
                  {item}
                </li>
              ))}
            </ul>
            <NavLink to="/vacuums" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold">
              Shop Vacuums <ArrowRight className="w-5 h-5" />
            </NavLink>
          </div>
          <div className="relative group">
            <div className="bg-slate-50 rounded-3xl p-4 md:p-8 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-slate-200 aspect-video overflow-hidden">
                <img 
                  loading="lazy"
                  decoding="async"
                  src="https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800&fm=webp" 
                  alt="Heavy-duty cordless vacuum cleaner in action"
                  className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
                  width="600"
                  height="337"
                />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                  <span className="text-white font-black text-4xl tracking-tighter uppercase italic">The Field Report</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900 py-16 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-orange-500 text-orange-500" />)}
          </div>
          <blockquote className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-12 max-w-4xl mx-auto italic">
            "CordlessToolz has become my go-to store for job site tools. The product details are accurate, shipping was smooth, and I found exactly what I needed."
          </blockquote>
          <div>
            <img 
              loading="lazy"
              decoding="async"
              src="https://img.magnific.com/premium-psd/psd-chinese-construction-engineer-with-arms-crossed-construction-management-concept_401927-3393.jpg?semt=ais_incoming&w=740&q=80" 
              alt="Marcus Chen" 
              className="w-16 h-16 object-cover bg-slate-800 rounded-full mx-auto mb-4 border-2 border-orange-600" 
              referrerPolicy="no-referrer"
              width="64"
              height="64"
            />
            <p className="text-white font-bold">Marcus Chen</p>
            <p className="text-slate-500 text-sm">Lead Foreman, Skyline Construction</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">What are the best cordless power tools for contractors?</h3>
            <p className="text-slate-600">The best cordless power tools for contractors feature brushless motors, high-capacity lithium-ion batteries, and heavy-duty build quality. Leading brands include DeWalt, Makita, and Milwaukee.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">How long do cordless tool batteries last?</h3>
            <p className="text-slate-600">Cordless tool batteries typically last between 3 to 5 years, or roughly 1,000 charge cycles, depending on usage intensity and charging habits.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Can I use the same battery for different cordless tools?</h3>
            <p className="text-slate-600">Yes, if the tools are from the same brand and share the same battery platform (e.g., 18V or 20V MAX). Always check manufacturer compatibility before swapping.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
