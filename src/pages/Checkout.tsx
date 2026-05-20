import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Truck, Lock, CreditCard, ArrowLeft, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { createOrder } from '../services/orderService';
import { SEO } from '../components/SEO';

export function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'zelle' | 'email_link'>('paypal');
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const shipping = cartTotal < 199 ? 9.99 : 0;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + shipping + tax;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.lastName) newErrors.lastName = 'Required';
    if (!formData.address) newErrors.address = 'Required';
    if (!formData.city) newErrors.city = 'Required';
    if (!formData.zip) newErrors.zip = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    if (!validate()) return;
    if (cart.length === 0) {
      setGeneralError('Your cart is empty.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create order entry in DB
      const orderId = await createOrder({
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totals: {
          subtotal: cartTotal,
          shipping: shipping,
          tax: tax,
          grandTotal: grandTotal,
        }
      });
      
      clearCart();
      
      const orderSummary = cart.map(item => `${item.quantity}x ${item.name} ($${item.price})`).join('%0D%0A');
      const paymentMethodName = paymentMethod === 'email_link' ? 'Pay by Link' : 
                               paymentMethod === 'paypal' ? 'PayPal' : 'Zelle';
                               
      const emailBody = `New Order Request%0D%0A%0D%0A` +
        `Customer Details:%0D%0A` +
        `Name: ${formData.firstName} ${formData.lastName}%0D%0A` +
        `Email: ${formData.email}%0D%0A` +
        `Address: ${formData.address}, ${formData.city}, ${formData.zip}%0D%0A` +
        `Phone: ${formData.phone}%0D%0A%0D%0A` +
        `Selected Payment Method: ${paymentMethodName}%0D%0A%0D%0A` +
        `Order Summary:%0D%0A${orderSummary}%0D%0A%0D%0A` +
        `Totals:%0D%0A` +
        `Subtotal: $${cartTotal.toFixed(2)}%0D%0A` +
        `Shipping: $${shipping.toFixed(2)}%0D%0A` +
        `Tax: $${tax.toFixed(2)}%0D%0A` +
        `Grand Total: $${grandTotal.toFixed(2)}\n\n` +
        `Please send payment instructions or a payment link to ${formData.email} to complete this order.`;

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ['austinlouisetx@gmail.com', formData.email],
          subject: `New Order Confirmation: ${formData.firstName} ${formData.lastName}`,
          text: emailBody.replace(/%0D%0A/g, '\n') // Switch back to normal newlines for the backend
        })
      });

      if (!response.ok) {
        // We log the error but still let the order succeed natively 
        console.error("Failed to send confirmation email", await response.text());
      }
      
      // Wait briefly, then navigate
      setTimeout(() => {
        navigate(`/order-success?id=${orderId}`, { replace: true });
      }, 500);
    } catch (error) {
      console.error(error);
      setGeneralError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-24 text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-4">Your Toolbox is Empty</h1>
        <p className="text-slate-500 mb-8">Add some professional gear to get started.</p>
        <NavLink to="/" className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold">
          Browse Best Sellers
        </NavLink>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 bg-slate-50 min-h-screen">
      <SEO 
        title="Secure Checkout | CordlessToolz"
        description="Securely complete your purchase at CordlessToolz." 
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 mb-8 text-xs font-bold uppercase tracking-widest text-slate-400">
          <NavLink to="/" className="hover:text-orange-600">Home</NavLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">Secure Checkout</span>
        </div>
        <h1 className="sr-only">Secure Checkout</h1>

        {generalError && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-bold">
            {generalError}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Main Form */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Shipping Information */}
              <div className="bg-white rounded-3xl p-6 md:p-8 premium-shadow border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className={cn(
                        "w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600/20 transition-all",
                        errors.email ? "border-red-500 bg-red-50/50" : "border-slate-200"
                      )}
                      placeholder="pro@example.com"
                      autoComplete="email"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">First Name *</label>
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className={cn(
                        "w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600/20",
                        errors.firstName ? "border-red-500 bg-red-50/50" : "border-slate-200"
                      )}
                      autoComplete="given-name"
                    />
                    {errors.firstName && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className={cn(
                        "w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600/20",
                        errors.lastName ? "border-red-500 bg-red-50/50" : "border-slate-200"
                      )}
                      autoComplete="family-name"
                    />
                    {errors.lastName && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.lastName}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Delivery Address *</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className={cn(
                        "w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600/20",
                        errors.address ? "border-red-500 bg-red-50/50" : "border-slate-200"
                      )}
                      placeholder="Street address and apartment"
                      autoComplete="street-address"
                    />
                    {errors.address && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">City *</label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className={cn(
                        "w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600/20",
                        errors.city ? "border-red-500 bg-red-50/50" : "border-slate-200"
                      )}
                      autoComplete="address-level2"
                    />
                    {errors.city && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ZIP / Postal Code *</label>
                    <input 
                      type="text" 
                      value={formData.zip}
                      onChange={e => setFormData({...formData, zip: e.target.value})}
                      className={cn(
                        "w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600/20",
                        errors.zip ? "border-red-500 bg-red-50/50" : "border-slate-200"
                      )}
                      autoComplete="postal-code"
                    />
                    {errors.zip && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.zip}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-3xl p-6 md:p-8 premium-shadow border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                       <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Select Payment Method</h2>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-400">VISA</div>
                    <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-400">MC</div>
                    <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-400">AMEX</div>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={cn(
                      "py-3 px-4 rounded-xl border text-sm font-bold transition-all",
                      paymentMethod === 'paypal' ? "border-orange-600 bg-orange-50 text-orange-600" : "border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('zelle')}
                    className={cn(
                      "py-3 px-4 rounded-xl border text-sm font-bold transition-all",
                      paymentMethod === 'zelle' ? "border-orange-600 bg-orange-50 text-orange-600" : "border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    Zelle
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('email_link')}
                    className={cn(
                      "py-3 px-4 rounded-xl border text-sm font-bold transition-all",
                      paymentMethod === 'email_link' ? "border-orange-600 bg-orange-50 text-orange-600" : "border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    Pay by Link
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className={cn(
                  "w-full bg-orange-600 text-white py-6 rounded-2xl font-black text-xl shadow-2xl shadow-orange-600/20 transition-all flex items-center justify-center gap-3",
                  isProcessing ? "opacity-75 cursor-not-allowed" : "hover:bg-orange-700 hover:scale-[1.01] active:scale-95"
                )}
              >
                {isProcessing ? (
                  <>Processing Your Order...</>
                ) : (
                  <>Place Order</>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" /> AES-256 Bit SSL Encrypted. Your security is our priority.
              </p>
            </form>
          </div>

          {/* Sidebar / Summary */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 premium-shadow">
              <h3 className="text-lg font-black text-slate-900 mb-6">Order Summary</h3>
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl p-2 border border-slate-100 shrink-0">
                      <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1594818821917-001a707ecc5c?auto=format&fit=crop&q=80&w=800'} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-slate-500 font-medium">Shipping</span>
                  <span className={cn("font-bold text-[10px] uppercase", shipping === 0 ? "text-green-600" : "text-slate-900")}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Estimated Tax</span>
                  <span className="text-slate-900 font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl pt-3 border-t border-slate-100">
                   <span className="font-black text-slate-900">Total</span>
                   <span className="font-black text-orange-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex gap-4">
              <Info className="w-6 h-6 text-orange-600 shrink-0" />
              <p className="text-xs text-orange-800 leading-relaxed">
                <span className="font-bold">Shipping Delay Notice:</span> Due to high demand, some orders may take an additional 2-3 days for processing. You will receive a tracking link via email once shipped.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 px-4">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-slate-400" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3-Year Precision Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                 <Truck className="w-5 h-5 text-slate-400" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Insured Priority Handling</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
