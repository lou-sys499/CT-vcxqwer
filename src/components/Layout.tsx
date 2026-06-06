import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Wrench, ArrowRight, Layout as LayoutIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';
import { CATEGORIES as STATIC_CATEGORIES } from '../data';
import { Category, Product } from '../types';
import { LEGACY_PRODUCTS_MAPPING } from '../utils/legacyProducts';
import { getProductUrl } from '../utils/seo';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>(STATIC_CATEGORIES);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const { cartCount } = useCart();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const fetchCatsAndProducts = async () => {
      try {
        const { getFirestoreCategories, getFirestoreProducts } = await import('../services/productService');
        const fbCats = await getFirestoreCategories();
        const combinedCats = [...STATIC_CATEGORIES, ...fbCats].filter(Boolean);
        const uniqueCats = Array.from(new Map(combinedCats.map(c => [c.id, c])).values());
        setCategories(uniqueCats);

        const fbProducts = await getFirestoreProducts();
        setAllProducts(fbProducts);
      } catch (err) {
        console.error("Failed to fetch initial navbar data:", err);
      }
    };
    fetchCatsAndProducts();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const suggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lower = searchQuery.toLowerCase().trim();
    const matches: Product[] = [];
    
    allProducts.forEach(p => {
      const nameMatch = p.name?.toLowerCase().includes(lower);
      const brandMatch = p.brand?.toLowerCase().includes(lower);
      const descMatch = p.description?.toLowerCase().includes(lower);
      
      const isLegacyMatch = LEGACY_PRODUCTS_MAPPING.some(mapping => 
        mapping.officialId === p.id && 
        mapping.legacyNames.some(legacyName => legacyName.includes(lower) || lower.includes(legacyName))
      );

      if (nameMatch || brandMatch || descMatch || isLegacyMatch) {
        matches.push(p);
      }
    });

    return matches.slice(0, 5);
  }, [searchQuery, allProducts]);


  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-lg border-b border-slate-200 py-3 shadow-sm" : "bg-transparent py-5"
      )}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3">
              <img 
                src="https://i.postimg.cc/mkb6RVph/cordlesstoolz-logo.png" 
                alt="CordlessToolz Logo"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain"
                width="40"
                height="40"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594818821917-001a707ecc5c?auto=format&fit=crop&q=80&w=100";
                }}
              />
              <span className={cn(
                "text-xl md:text-2xl font-black tracking-tighter text-slate-900 uppercase italic"
              )}>
                Cordless<span className="text-orange-600">Toolz</span>
              </span>
            </NavLink>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {/* Vacuums */}
              <div className="relative group">
                <NavLink 
                  to="/category/cordless-vacuums"
                  className={({isActive}) => cn(
                    "text-sm font-semibold transition-colors hover:text-orange-600 whitespace-nowrap py-2",
                    isActive ? "text-orange-600" : "text-slate-600"
                  )}
                >
                  Vacuums
                </NavLink>
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white shadow-xl rounded-xl p-4 border border-slate-100 min-w-[250px]">
                    <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Vacuums</h4>
                    <NavLink to="/product/Gfq4mE7ycIlFcIBLAwJ9" className="block text-sm font-medium text-slate-700 hover:text-orange-600 py-1">Smoture VC70 Cordless Vacuum Cleaner</NavLink>
                    <NavLink to="/product/WXVUNB4VdAHjPTHJKBVF" className="block text-sm font-medium text-slate-700 hover:text-orange-600 py-1">VacLife US726 Cordless Handheld Vacuum</NavLink>
                    <NavLink to="/product/UhD1sUQ6K7rFWMvCyBqe" className="block text-sm font-medium text-slate-700 hover:text-orange-600 py-1">Inteture Cordless Vacuum JR400</NavLink>
                    <NavLink to="/product/H8nxPWb4gFbyc3vCmt0M" className="block text-sm font-medium text-slate-700 hover:text-orange-600 py-1">Dolphin LIBERTY 200 Pool Cleaner</NavLink>

                  </div>
                </div>
              </div>

              {/* Power Tools */}
              <div className="relative group">
                <NavLink 
                  to="/category/power-tools"
                  className={({isActive}) => cn(
                    "text-sm font-semibold transition-colors hover:text-orange-600 whitespace-nowrap py-2",
                    isActive ? "text-orange-600" : "text-slate-600"
                  )}
                >
                  Power Tools
                </NavLink>
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white shadow-xl rounded-xl p-4 border border-slate-100 min-w-[250px]">
                    <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Power Tools</h4>
                    <NavLink to="/product/bJC3LXXaI6nnVx1LPDZQ" className="block text-sm font-medium text-slate-700 hover:text-orange-600 py-1">DeWalt 20V MAX* XR 18Ga Brad Nailer Kit</NavLink>
                    <NavLink to="/product/DkEyWlilG9aPHXpLPpnB" className="block text-sm font-medium text-slate-700 hover:text-orange-600 py-1">DeWalt 20V MAX* XR Cordless 7-1/4 In. Circular Saw Kit</NavLink>
                    <NavLink to="/product/IMe77QhP3Fp46n47EX22" className="block text-sm font-medium text-slate-700 hover:text-orange-600 py-1">Rivet Nut Tool-30-R1</NavLink>
                    <NavLink to="/product/hVZ0Rdg3yCTMk638A7XE" className="block text-sm font-medium text-slate-700 hover:text-orange-600 py-1">RYOBI 18V ONE+ HP Compact Brushless 1/2" Drill/Driver Kit</NavLink>
                  </div>
                </div>
              </div>

              {/* Buying Guides */}
              <div className="relative group">
                <NavLink 
                  to="/blog"
                  className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors py-2"
                >
                  Buying Guides
                </NavLink>
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white shadow-xl rounded-xl p-4 border border-slate-100 min-w-[200px]">
                    <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Buying Guides</h4>
                    <NavLink to="/blog/qDLx8R50DsuPNUecwKNT" className="block text-sm font-medium text-slate-700 hover:text-orange-600 py-1">Best Ice Auger for Cordless Drill</NavLink>
                    <NavLink to="/blog/rIc0Vs1eO7t27hcrGqYH" className="block text-sm font-medium text-slate-700 hover:text-orange-600 py-1">Best Cordless Vacuums</NavLink>
                    <NavLink to="/blog/DycH1r4dP0LlQTK2ayXH" className="block text-sm font-medium text-slate-700 hover:text-orange-600 py-1">Best Cordless Nailers</NavLink>
                  </div>
                </div>
              </div>
              
              <NavLink to="/blog" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Blog</NavLink>
              <NavLink to="/about" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">About</NavLink>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <NavLink to="/admin" className="hidden md:block p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <LayoutIcon className="w-4 h-4" />
              </NavLink>
              
              {isSearchOpen && (
                <div className="absolute left-4 right-4 top-full mt-2 md:mt-0 md:left-auto md:right-32 md:top-1/2 md:-translate-y-1/2 min-w-[320px] max-w-sm z-50">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                        setIsSearchOpen(false);
                      }
                    }}
                    className="relative"
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 md:py-2 border border-slate-200 rounded-full focus:outline-none focus:border-orange-500 shadow-xl bg-white text-slate-800"
                    />
                  </form>
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden py-2 max-h-[300px] overflow-y-auto">
                      <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-100">
                        Search Suggestions
                      </div>
                      {suggestions.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            navigate(getProductUrl(p));
                            setSearchQuery('');
                            setIsSearchOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-3 border-b border-slate-50 last:border-none"
                        >
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1594818821917-001a707ecc5c?auto=format&fit=crop&q=80&w=100'}
                            alt={p.name}
                            className="w-8 h-8 object-contain rounded bg-slate-50"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                            <p className="text-xs text-orange-500 font-bold uppercase tracking-wider text-[9px]">{p.brand}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
                
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={cn(
                  "p-2 rounded-full transition-colors",
                  scrolled ? "text-slate-600 hover:bg-slate-100" : "text-slate-600 hover:bg-white/10"
                )}>
                  <Search className="w-5 h-5" />
                </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-bold px-1 rounded-full min-w-[16px] text-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button 
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={cn(
            "md:hidden absolute top-full left-0 right-0 w-full bg-white border-b border-slate-100 shadow-xl overflow-y-auto transition-all duration-300 origin-top",
            isMobileMenuOpen ? "opacity-100 scale-y-100 visible max-h-[85vh]" : "opacity-0 scale-y-0 invisible max-h-0"
          )}
        >
          <div className="px-4 py-6 space-y-4">
            {categories.map((cat) => (
              <NavLink 
                key={cat.slug} 
                to={`/category/${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-semibold text-slate-900 hover:text-orange-600"
              >
                {cat.name}
              </NavLink>
            ))}
            <NavLink 
              to="/blog?category=Guides"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-semibold text-slate-900 hover:text-orange-600"
            >
              Buying Guides
            </NavLink>
            <NavLink 
              to="/blog?category=Reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-semibold text-slate-900 hover:text-orange-600"
            >
              Field Reviews
            </NavLink>
            <NavLink 
              to="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-semibold text-slate-900 hover:text-orange-600"
            >
              Pro Blog
            </NavLink>
            <NavLink 
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-semibold text-slate-900 hover:text-orange-600"
            >
              About Us
            </NavLink>
            <div className="pt-4 border-t border-slate-100">
              <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-slate-500 font-bold">
                Admin Portal
              </NavLink>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }}
                className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-2"
              >
                Shop All Tools <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <img 
              src="https://i.postimg.cc/mkb6RVph/cordlesstoolz-logo.png" 
              alt="CordlessToolz Footer Logo"
              referrerPolicy="no-referrer"
              className="w-8 h-8 object-contain"
              width="32"
              height="32"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594818821917-001a707ecc5c?auto=format&fit=crop&q=80&w=100";
              }}
            />
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              Cordless<span className="text-orange-600">Toolz</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-8 max-w-sm">
            Empowering professionals and DIY enthusiasts with the world's most powerful, precision-engineered cordless tools.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholders */}
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
              <span className="text-xs font-bold text-white">fb</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
              <span className="text-xs font-bold text-white">tw</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
              <span className="text-xs font-bold text-white">ig</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Shop Core Categories</h4>
          <ul className="space-y-4 text-sm">
            <li><NavLink to="/" className="hover:text-white transition-colors">Browse Professional Cordless Tools Catalog</NavLink></li>
            <li><NavLink to="/category/cordless-vacuums" className="hover:text-white transition-colors">Shop High-Efficiency Battery Vacuums</NavLink></li>
            <li><NavLink to="/category/power-tools" className="hover:text-white transition-colors">Explore Rugged Contractor Power Tools</NavLink></li>
            <li><NavLink to="/tool-accessories" className="hover:text-white transition-colors">Upgrade Specialized Gear & Accessories</NavLink></li>
            <li><NavLink to="/search?q=" className="hover:text-white transition-colors">Search the Complete Inventory Directory</NavLink></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Support & Help</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="mailto:support@cordlesstoolz.com" className="hover:text-white transition-colors">Contact Support Staff Directly</a></li>
            <li><NavLink to="/shipping-policy" className="hover:text-white transition-colors">Review Shipping Speed & Processing Rates</NavLink></li>
            <li><NavLink to="/refund-policy" className="hover:text-white transition-colors">Examine 90-Day Return & Refund Guarantees</NavLink></li>
            <li><NavLink to="/sitemap" className="hover:text-white transition-colors">Navigate Complete Sitemap Directory</NavLink></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Discover & Learn</h4>
          <ul className="space-y-4 text-sm">
            <li><NavLink to="/about" className="hover:text-white transition-colors">Explore Customer Centered Values & Core Story</NavLink></li>
            <li><NavLink to="/blog" className="hover:text-white transition-colors">Browse Professional Buying Recommendations</NavLink></li>
            <li><NavLink to="/recipes" className="hover:text-white transition-colors">Build with DIY Project Modification Recipes</NavLink></li>
            <li><NavLink to="/vacuums" className="hover:text-white transition-colors">Research Vacuum Engineering & Airflow Details</NavLink></li>
            <li><NavLink to="/admin" className="hover:text-white transition-colors">Authorized Personnel Command Control Center</NavLink></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-white font-bold mb-6">Join The High-Voltage List</h4>
          <p className="text-sm mb-4">Get exclusive gear updates and "insider-only" discounts every week.</p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-slate-800 border-none rounded-lg px-4 py-3 text-sm w-full focus:ring-2 focus:ring-orange-600 outline-none"
            />
            <button className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[10px] mt-4 opacity-50">By subscribing you agree to our <NavLink to="/terms" className="underline hover:text-white">Terms</NavLink> and <NavLink to="/privacy" className="underline hover:text-white">Privacy Policy</NavLink>.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2026 CordlessToolz. Pro Gear. Pro Service. No Cords.</p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          <NavLink to="/privacy" className="hover:text-white transition-colors">Privacy Policy</NavLink>
          <NavLink to="/terms" className="hover:text-white transition-colors">Terms of Service</NavLink>
          <NavLink to="/sitemap" className="hover:text-white transition-colors">Sitemap</NavLink>
        </div>
      </div>
    </footer>
  );
}
