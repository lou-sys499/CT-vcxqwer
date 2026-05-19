import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleStartShopping = () => {
    onClose();
    navigate('/');
    setTimeout(() => {
      document.getElementById('top-picks')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-black text-slate-900">Your Toolbox <span className="text-slate-400 font-bold ml-1">({cartCount})</span></h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="bg-slate-50 p-8 rounded-full mb-6">
                    <ShoppingBag className="w-12 h-12 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Toolbox Empty</h3>
                  <p className="text-slate-500 mb-8 max-w-[240px]">You haven't added any pro gear yet.</p>
                  <button onClick={handleStartShopping} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-slate-50 rounded-2xl p-2 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                      <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1594818821917-001a707ecc5c?auto=format&fit=crop&q=80&w=800'} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{item.name}</h4>
                        <p className="text-orange-600 font-bold text-xs uppercase tracking-widest">{item.brand}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 hover:bg-slate-100 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-slate-400" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 hover:bg-slate-100 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="font-black text-slate-900 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                           <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="text-slate-900 font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500 font-medium">Shipping</span>
                    {cartTotal < 199 ? (
                      <span className="text-slate-900 font-bold text-[10px] uppercase">$9.99</span>
                    ) : (
                      <span className="text-green-600 font-bold uppercase text-[10px]">Free Shipping</span >
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Estimated Total</span>
                      <span className="text-3xl font-black text-slate-900 leading-none">${(cartTotal + (cartTotal < 199 ? 9.99 : 0)).toFixed(2)}</span>
                   </div>
                </div>
                <NavLink 
                  to="/checkout" 
                  onClick={onClose}
                  className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-orange-600/30 hover:bg-orange-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Zap className="w-6 h-6" /> Secure Checkout <ArrowRight className="w-5 h-5" />
                </NavLink>
                <p className="text-[10px] text-center text-slate-400 font-medium">Safe & Secure 256-bit SSL encrypted checkout.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
