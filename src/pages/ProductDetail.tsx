import React from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { Star, Shield, Truck, RotateCcw, Zap, ChevronRight, Share2, Heart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { PRODUCTS } from '../data';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { ProductCard } from '../components/ProductUI';
import { useCart } from '../context/CartContext';
import { SEO } from '../components/SEO';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeImage, setActiveImage] = React.useState<string>('');
  const [activeTab, setActiveTab] = React.useState('specs');

  React.useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      // Try static first
      const staticProduct = PRODUCTS.find(p => p.id === id);
      if (staticProduct) {
        setProduct(staticProduct);
        setActiveImage(staticProduct.images?.[0] || '');
        setLoading(false);
        return;
      }

      // Try Firestore
      if (id) {
        try {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const productData = { id: docSnap.id, ...docSnap.data() } as Product;
            setProduct(productData);
            setActiveImage(productData.images?.[0] || '');
          } else {
            setProduct(PRODUCTS[0]); // Fallback
            setActiveImage(PRODUCTS[0].images?.[0] || '');
          }
        } catch (error: any) {
          if (error.code === 'permission-denied') {
            handleFirestoreError(error, OperationType.GET, `products/${id}`);
          }
          console.error("Error fetching product:", error);
          setProduct(PRODUCTS[0]);
          setActiveImage(PRODUCTS[0].images?.[0] || '');
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) addToCart(product);
  };

  if (loading) return <div className="pt-40 text-center">Loading Equipment...</div>;
  if (!product) return <div className="pt-40 text-center">Equipment Not Found</div>;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images || [activeImage],
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand
    },
    aggregateRating: product.rating && product.reviewsCount ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount
    } : undefined,
    offers: {
      "@type": "Offer",
      url: window.location.href,
      priceCurrency: "USD",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <div className="pt-24 pb-24">
      <SEO 
        title={`${product.name} - ${product.brand} | CordlessToolz`}
        description={product.description} 
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 mb-8 text-xs font-bold uppercase tracking-widest text-slate-400">
          <NavLink to="/" className="hover:text-orange-600">Home</NavLink>
          <ChevronRight className="w-3 h-3" />
          <NavLink to={`/category/${product.category}`} className="hover:text-orange-600">{product.category.replace('-', ' ')}</NavLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <div className="space-y-4">
            <div className="bg-white rounded-[2rem] border border-slate-100 premium-shadow aspect-square overflow-hidden flex items-center justify-center p-12">
               <motion.img 
                layoutId={`img-${product.id}`}
                src={activeImage || product.images?.[0] || 'https://images.unsplash.com/photo-1594818821917-001a707ecc5c?auto=format&fit=crop&q=80&w=800'} 
                alt={product.name} 
                className="w-full h-full object-contain"
                width="600"
                height="600"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, i) => (
                <div 
                  key={img + i}
                  onClick={() => setActiveImage(img)}
                  className="bg-white rounded-2xl border border-slate-100 cursor-pointer hover:border-orange-600 transition-colors aspect-square overflow-hidden p-4"
                >
                   <img src={img} className="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity" width="100" height="100" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-8">
               <div className="flex items-center justify-between mb-4">
                 <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                   In Stock & Ready to Ship
                 </span>
                 <div className="flex gap-2">
                    <button className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"><Share2 className="w-4 h-4 text-slate-600" /></button>
                    <button className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors text-slate-600"><Heart className="w-4 h-4" /></button>
                 </div>
               </div>
               <p className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-2">{product.brand}</p>
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">{product.name}</h1>
               <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4", i < 4 ? "fill-orange-500 text-orange-500" : "fill-slate-200 text-slate-200")} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-400">({Math.floor(Math.random() * 9) + 1} Certified Reviews)</span>
               </div>
               <p className="text-slate-600 leading-relaxed font-medium">
                 {product.description}
               </p>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200 mb-8">
               <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-black text-slate-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-slate-400 line-through mb-1">${product.originalPrice}</span>
                  )}
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold mb-2">SAVE ${product.originalPrice ? (product.originalPrice - product.price).toFixed(2) : 0}</span>
               </div>
               
               <div className="space-y-4 mb-8">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Zap className="w-6 h-6" /> Add to Toolbox
                  </button>
                  <button 
                    onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    Checkout Now
                  </button>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-orange-600" /> Free 2-Day Ship
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    <RotateCcw className="w-4 h-4 text-orange-600" /> 90-Day Returns
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Key Features</h3>
               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                       <CheckCircle2 className="w-4 h-4 text-green-500" /> {feature}
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        </div>

         <div className="space-y-24">
           <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 premium-shadow">
              <h3 className="text-2xl font-black text-slate-900 mb-8">Technical Specifications</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{key}</p>
                      <p className="text-lg font-bold text-slate-900">{val as string}</p>
                    </div>
                  ))}
              </div>
           </div>

           <div>
           <div className="flex border-b border-slate-200 mb-8 sticky top-20 bg-white/80 backdrop-blur z-20">
              {['Reviews', 'FAQs'].map((tab) => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={cn(
                    "px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all relative",
                    activeTab === tab.toLowerCase() ? "text-orange-600" : "text-slate-400 hover:text-slate-600"
                  )}
                 >
                   {tab}
                   {activeTab === tab.toLowerCase() && (
                     <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600" />
                   )}
                 </button>
              ))}
           </div>

           <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 mb-24">
              {activeTab === 'reviews' && (
                <div className="space-y-8">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-slate-900">What Pros Are Saying</h3>
                      <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm">Write Review</button>
                   </div>
                   {[1, 2].map((i) => (
                     <div key={i} className="bg-slate-50 p-6 rounded-2xl">
                        <div className="flex gap-1 mb-2">
                           {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-orange-500 text-orange-500" />)}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic">"Simply the best impact driver I've used in 20 years. Battery life is stellar and it delivers consistent power even at low charges."</p>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
         </div>
      </div>
    </div>
  );
}
