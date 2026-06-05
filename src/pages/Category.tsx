import React from 'react';
import { useParams, NavLink, useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, ChevronDown, SlidersHorizontal, ArrowLeft, X, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { CATEGORIES, PRODUCTS } from '../data';
import { ProductCard } from '../components/ProductUI';
import { getFirestoreProducts, getFirestoreCategories } from '../services/productService';
import { Product, Category as CategoryType } from '../types';
import { cn } from '../lib/utils';
import { SEO } from '../components/SEO';

export function Category() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const brandParam = searchParams.get('brand');
  const [category, setCategory] = React.useState<CategoryType | null>(null);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const [sort, setSort] = React.useState<string>('featured');
  const [filterBrand, setFilterBrand] = React.useState<string[]>([]);
  const [filterPower, setFilterPower] = React.useState<number>(45);
  const [filterFeatures, setFilterFeatures] = React.useState<string[]>([]);
  const [filterInStock, setFilterInStock] = React.useState<boolean>(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = React.useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);

  const BRANDS = ['Smoture', 'VacLife', 'Inteture', 'Dolphin'];

  // Sync brandParam with state
  React.useEffect(() => {
    if (brandParam) {
      const canonicalBrand = BRANDS.find(b => b.toLowerCase() === brandParam.toLowerCase()) || brandParam;
      setFilterBrand([canonicalBrand]);
    } else {
      setFilterBrand([]);
    }
  }, [brandParam]);

  React.useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      
      // Fetch category
      const fbCats = await getFirestoreCategories();
      const combinedCats = [...CATEGORIES, ...fbCats];
      const uniqueCats = Array.from(new Map(combinedCats.map(c => [c.id, c])).values());
      const currentCategory = uniqueCats.find(c => c.slug === slug);
      
      if (currentCategory) {
        setCategory(currentCategory);
      } else if (uniqueCats.length > 0) {
        setCategory(uniqueCats[0]);
      }
      
      // Fetch products
      const fbProducts = await getFirestoreProducts(slug);
      let staticProducts = PRODUCTS.filter(p => p.category === slug);
      
      const combined = [...fbProducts, ...staticProducts];
      const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());
      
      setAllProducts(unique);
      setLoading(false);
    };
    fetchCategoryAndProducts();
  }, [slug]);

  const displayedProducts = React.useMemo(() => {
    let filtered = allProducts;
    
    if (filterBrand.length > 0) {
      filtered = filtered.filter(p => filterBrand.some(b => b.toLowerCase() === p.brand.toLowerCase()));
    }

    if (filterInStock) {
      filtered = filtered.filter(p => p.inStock !== false); // Assume true if undefined for now, or check strictly
    }

    if (filterPower < 45) {
      filtered = filtered.filter(p => (p.suction_power_kpa || 0) >= filterPower);
    }

    if (filterFeatures.length > 0) {
      filtered = filtered.filter(p => 
        filterFeatures.every(f => 
          p.features.some(pf => pf.toLowerCase().includes(f.toLowerCase()))
        )
      );
    }
    
    // Sorting
    return [...filtered].sort((a, b) => {
      switch(sort) {
        case 'newest': {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        }
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'performance': return (b.suction_power_kpa || 0) - (a.suction_power_kpa || 0);
        default: return (b.totalSales || 0) - (a.totalSales || 0) || (b.popularity || 0) - (a.popularity || 0);
      }
    });
  }, [allProducts, filterBrand, sort, filterInStock, filterPower, filterFeatures]);

  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn("space-y-8", isMobile && "p-6")}>
      <div>
        <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-[10px]">Brand</h3>
        <div className="space-y-3">
          {['Smoture', 'VacLife', 'Inteture', 'Dolphin'].map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filterBrand.includes(brand)}
                onChange={(e) => {
                  if (e.target.checked) setFilterBrand(prev => [...prev, brand]);
                  else setFilterBrand(prev => prev.filter(b => b !== brand));
                }}
                className="w-5 h-5 rounded-md border-slate-300 text-orange-600 focus:ring-orange-600 cursor-pointer" 
              />
              <span className="text-sm font-semibold text-slate-600 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-[10px]">Suction Power</h3>
        <input 
          type="range" 
          min="20" 
          max="45" 
          value={filterPower}
          onChange={(e) => setFilterPower(parseInt(e.target.value))}
          className="w-full accent-orange-600 cursor-pointer" 
        />
        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
          <span>20KPa</span>
          <span className="text-orange-600 font-black">{filterPower}KPa+</span>
          <span>45KPa</span>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-[10px]">Features</h3>
        <div className="space-y-3">
          {['Self-standing', 'LED Touch Screen', 'Brushless Motor'].map(feature => (
            <label key={feature} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filterFeatures.includes(feature)}
                onChange={(e) => {
                  if (e.target.checked) setFilterFeatures(prev => [...prev, feature]);
                  else setFilterFeatures(prev => prev.filter(f => f !== feature));
                }}
                className="w-5 h-5 rounded-md border-slate-300 text-orange-600 focus:ring-orange-600 cursor-pointer" 
              />
              <span className="text-sm font-semibold text-slate-600 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-[10px]">Availability</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={filterInStock}
            onChange={(e) => setFilterInStock(e.target.checked)}
            className="w-5 h-5 rounded-md border-slate-300 text-orange-600 focus:ring-orange-600 cursor-pointer" 
          />
          <span className="text-sm font-semibold text-slate-600 group-hover:text-orange-600 transition-colors uppercase tracking-tight">In Stock Only</span>
        </label>
      </div>

      {isMobile && (
        <button 
          onClick={() => setIsMobileModalOpen(false)}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold mt-8"
        >
          See {displayedProducts.length} Results
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-24 pb-24 min-h-screen">
      {category && (
        <SEO 
          title={`${category.name.toLowerCase().includes('cordless') ? category.name : 'Cordless ' + category.name}`}
          description={`Browse professional-grade cordless ${category.name.toLowerCase()} and premium power tools at CordlessToolz. Guaranteed durability for elite contractors.`} 
        />
      )}
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <NavLink to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 text-sm font-bold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </NavLink>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-4">
                  {category?.name ? (category.name.toLowerCase().includes('cordless') ? category.name : `Cordless ${category.name}`) : <span className="inline-block h-12 w-64 bg-slate-200 animate-pulse rounded-lg"></span>}
                </h1>
                <p className="text-slate-500 max-w-2xl leading-relaxed">
                  {category?.name ? `Browse our premium selection of cordless ${category.name.toLowerCase()} and high-performance power tools built for heavy-duty contractors.` : <span className="inline-block h-6 w-full max-w-md bg-slate-100 animate-pulse rounded"></span>}
                </p>
              </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters - Desktop */}
          {isSidebarVisible && (
            <aside className="hidden lg:block w-64 space-y-8 h-fit sticky top-40">
              <FilterContent />
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-grow">
            {/* Active Filter Chips */}
            {(filterBrand.length > 0 || filterFeatures.length > 0 || filterInStock || filterPower < 45) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filterBrand.map(b => (
                  <button key={b} onClick={() => setFilterBrand(prev => prev.filter(x => x !== b))} className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-orange-100 hover:bg-orange-100 transition-colors">
                    {b} <X className="w-3 h-3" />
                  </button>
                ))}
                {filterFeatures.map(f => (
                  <button key={f} onClick={() => setFilterFeatures(prev => prev.filter(x => x !== f))} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-slate-100 hover:bg-slate-100 transition-colors">
                    {f} <X className="w-3 h-3" />
                  </button>
                ))}
                {filterInStock && (
                  <button onClick={() => setFilterInStock(false)} className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-100 hover:bg-green-100 transition-colors">
                    In Stock <X className="w-3 h-3" />
                  </button>
                )}
                {filterPower < 45 && (
                  <button onClick={() => setFilterPower(45)} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-100 hover:bg-blue-100 transition-colors">
                    {filterPower}KPa+ <X className="w-3 h-3" />
                  </button>
                )}
                <button 
                  onClick={() => {
                    setFilterBrand([]);
                    setFilterFeatures([]);
                    setFilterInStock(false);
                    setFilterPower(45);
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 underline underline-offset-4 px-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Sticky Bar */}
            <div className="sticky top-20 bg-white/95 backdrop-blur-md z-30 border border-slate-100 p-4 rounded-2xl mb-8 flex items-center justify-between shadow-sm">
              <button 
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                className="hidden lg:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {isSidebarVisible ? 'Hide Filters' : 'Show Filters'}
              </button>
              <div className="lg:hidden" /> {/* Spacer for mobile */}
              
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sort by:</span>
                <select onChange={(e) => setSort(e.target.value)} value={sort} className="text-sm font-bold bg-transparent cursor-pointer outline-none border-none py-0 focus:ring-0 pr-8">
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="performance">Highest Performance</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-slate-200 animate-pulse h-96 rounded-3xl" />
                ))}
              </div>
            ) : displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No tools found matching these filters.</h3>
                <p className="text-slate-500">Try adjusting your filters or search for something else.</p>
                <button 
                  onClick={() => {
                    setFilterBrand([]);
                    setFilterFeatures([]);
                    setFilterInStock(false);
                    setFilterPower(45);
                  }} 
                  className="mt-4 text-orange-600 font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={() => setIsMobileModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filter & Sort
          { (filterBrand.length + filterFeatures.length + (filterInStock ? 1 : 0) + (filterPower < 45 ? 1 : 0)) > 0 && (
            <span className="bg-orange-600 w-5 h-5 rounded-full text-[10px] flex items-center justify-center">
              {filterBrand.length + filterFeatures.length + (filterInStock ? 1 : 0) + (filterPower < 45 ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
        >
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="absolute bottom-0 left-0 right-0 top-12 bg-white rounded-t-[3rem] overflow-y-auto shadow-2xl"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Filter & Sort</h2>
              <button 
                onClick={() => setIsMobileModalOpen(false)}
                className="bg-slate-100 p-3 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-10 pb-32">
              <div>
                <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-[10px]">Sort By</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'featured', label: 'Featured' },
                    { id: 'newest', label: 'Newest' },
                    { id: 'price-asc', label: 'Price: Low-High' },
                    { id: 'price-desc', label: 'Price: High-Low' },
                    { id: 'performance', label: 'Performance' },
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setSort(opt.id)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-bold border transition-all truncate",
                        sort === opt.id ? "bg-orange-600 border-orange-600 text-white shadow-lg" : "bg-white border-slate-200 text-slate-600"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <FilterContent isMobile />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
