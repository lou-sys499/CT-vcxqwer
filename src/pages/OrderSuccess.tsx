import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, Mail, ArrowRight, Zap, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { SEO } from '../components/SEO';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function OrderSuccess() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dbOrderId = searchParams.get('id');

  const orderNumber = dbOrderId ? dbOrderId.substring(0, 8).toUpperCase() : "CT-" + Math.floor(100000 + Math.random() * 900000);
  
  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    
    let startY = 20;

    // Attempt to load and add logo
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = 'https://i.postimg.cc/mkb6RVph/cordlesstoolz-logo.png';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 40;
        const imgHeight = (img.height / img.width) * imgWidth;
        doc.addImage(imgData, 'PNG', 20, 10, imgWidth, imgHeight);
        
        startY = 10 + imgHeight + 10; // Adjust Y position based on image height
      }
    } catch (e) {
      console.warn("Could not load logo for PDF", e);
      // Fallback text if logo fails
      doc.setFontSize(22);
      doc.text('CORDLESSTOOLZ', 20, startY);
      startY += 10;
    }
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Professional Power Tools & Equipment', 20, startY);
    startY += 15;
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Order Confirmation / Invoice', 20, startY);
    startY += 10;
    
    // Order ID
    doc.setFontSize(12);
    doc.text(`Order Number: #${orderNumber}`, 20, startY);
    startY += 7;
    
    const today = new Date().toLocaleDateString();
    doc.text(`Date: ${today}`, 20, startY);
    startY += 18;
    
    // Body Note
    doc.setFontSize(11);
    doc.text('Thank you for shopping at CordlessToolz.', 20, startY);
    startY += 6;
    doc.text('A detailed receipt and payment instructions have been sent to your email.', 20, startY);
    startY += 6;
    doc.text('Expected delivery: 2-3 Business Days.', 20, startY);
    startY += 6;
    doc.text('This document serves as proof of order initiation.', 20, startY);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('If you have any questions, please contact support at support@cordlesstoolz.com', 20, 280);
    
    doc.save(`Invoice_${orderNumber}.pdf`);
  };
  
  return (
    <div className="pt-24 pb-24 min-h-screen flex items-center justify-center bg-slate-50">
      <SEO 
        title="Order Successful | CordlessToolz"
        description="Your order has been successfully placed at CordlessToolz." 
      />
      <div className="max-w-xl w-full px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-8 md:p-12 text-center premium-shadow border border-slate-100"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Gear Secured!</h1>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Your order <span className="font-bold text-slate-900">#{orderNumber}</span> has been confirmed and is being prepped for shipment.
          </p>
          
          <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 mb-8">
             <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                   <p className="text-sm font-bold text-slate-900">Confirmation Sent</p>
                   <p className="text-xs text-slate-500">We've sent a detailed receipt to your email address.</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                   <p className="text-sm font-bold text-slate-900">Estimated Delivery</p>
                   <p className="text-xs text-slate-500">Expected arrival: 2-3 Business Days.</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-12">
             <button onClick={handleDownloadPDF} className="bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                <Download className="w-4 h-4" /> Download PDF Invoice
             </button>
             <NavLink to="/" className="bg-orange-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20">
                Continue Shopping <ArrowRight className="w-4 h-4" />
             </NavLink>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-center gap-6">
             <div className="flex flex-col items-center">
                <Zap className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority Prep</span>
             </div>
             <div className="flex flex-col items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3-Year Warranty</span>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
