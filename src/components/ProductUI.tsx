import React from 'react';
import { Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { getProductTags } from '../lib/tagging';
import { cn } from '../lib/utils';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl overflow-hidden premium-shadow border border-slate-100 flex flex-col h-full"
    >
      <NavLink to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-50">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1594818821917-001a707ecc5c?auto=format&fit=crop&q=80&w=800'} 
          alt={`Shop ${product.brand} ${product.name} cordless power tools & accessories online`} 
          className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
          width="400"
          height="400"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {getProductTags(product).map(tag => (
            <span key={tag} className={cn(
              "text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg",
              tag === 'NEW' ? 'bg-slate-900 text-white' : 
              tag === 'VALUE' ? 'bg-green-500 text-white' : 'bg-orange-600 text-white'
            )}>
              {tag}
            </span>
          ))}
          {product.discount && product.discount > 0 ? (
            <span className="bg-red-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              -{product.discount}% OFF
            </span>
          ) : null}
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
          }}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10"
        >
          <Zap className="w-5 h-5 text-orange-600" />
        </button>
      </NavLink>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={cn(
                "w-3 h-3",
                i < Math.floor(product.rating) ? "fill-orange-500 text-orange-500" : "fill-slate-200 text-slate-200"
              )} 
            />
          ))}
          <span className="text-[10px] font-bold text-slate-400 ml-1">({Math.floor(Math.random() * 9) + 1})</span>
        </div>

        <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">{product.brand}</p>
        <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          <NavLink to={`/product/${product.id}`} className="text-slate-400 hover:text-orange-600 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
};

export function TrustBar() {
  const items = [
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Lifetime Warranty", desc: "Built to last decades" },
    { icon: <Star className="w-5 h-5" />, title: "4.9/5 Average Rating", desc: "From over 10k pro reviews" },
    { icon: <Zap className="w-5 h-5" />, title: "Express Shipping", desc: "Free on orders over $199" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 bg-white rounded-3xl premium-shadow border border-slate-100 px-6 md:px-8">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="bg-orange-50 p-4 rounded-2xl text-orange-600">
            {item.icon}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-tight">{item.title}</h4>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
