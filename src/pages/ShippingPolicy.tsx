import React from 'react';
import { Truck, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

export function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 md:py-32">
      <SEO 
        title="Shipping Policy | CordlessToolz"
        description="Learn about the CordlessToolz shipping policy, rates, delivery timelines, and procedures." 
      />
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Shipping Policy</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          At CordlessToolz, we understand that getting your tools and equipment quickly and safely is vital to your work and home projects. We partner with the industry's most reliable carriers to ensure your premium cordless products arrive on time.
        </p>
      </div>

      <div className="space-y-12">
        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Shipment Processing Time</h2>
          </div>
          <div className="space-y-4 text-slate-600">
            <p><strong>Processing Windows:</strong> All orders are processed and prepared for dispatch within 1–2 business days.</p>
            <p><strong>Operating Hours:</strong> Please note that orders are not processed, shipped, or delivered on weekends or statutory holidays.</p>
            <p><strong>Peak Volume Delivery:</strong> During periods of exceptionally high order volume, processing may be extended by a few days. Please allow additional transit days for final delivery. In the rare event of a significant, unexpected delay with your shipment, our customer service team will contact you directly via email or phone.</p>
          </div>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Shipping Rates & Delivery Estimates</h2>
          </div>
          <p className="text-slate-600 mb-6">
            Shipping charges for your order are calculated in real-time and will be clearly displayed during the checkout process.
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="py-4 px-6 font-bold text-slate-900 bg-slate-50 rounded-tl-xl whitespace-nowrap">Shipping Method</th>
                  <th className="py-4 px-6 font-bold text-slate-900 bg-slate-50 rounded-tr-xl">Estimated Delivery Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4 px-6 text-slate-600 font-medium whitespace-nowrap">Standard Shipping</td>
                  <td className="py-4 px-6 text-slate-600">3–5 business days</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-slate-600 font-medium whitespace-nowrap">Expedited Shipping</td>
                  <td className="py-4 px-6 text-slate-600">2–3 business days</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-slate-600 font-medium whitespace-nowrap">Priority Shipping</td>
                  <td className="py-4 px-6 text-slate-600">1–2 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600">
            <strong>Note:</strong> While we work closely with our carriers to meet these timelines, unexpected transit or carrier delays can occasionally occur.
          </div>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Shipment to P.O. Boxes or APO/FPO Addresses</h2>
          <div className="text-slate-600 space-y-4">
            <p>
              CordlessToolz proudly ships to addresses within the U.S., U.S. Territories, and APO/FPO/DPO military addresses. Please ensure your specific carrier accepts deliveries to these locations if ordering oversized items (such as large tool kits or heavy vacuums).
            </p>
          </div>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Shipment Confirmation & Order Tracking</h2>
          <div className="text-slate-600 space-y-4">
            <p>
              The moment your order leaves our facility, you will receive a Shipment Confirmation Email containing your unique tracking number(s). Your tracking details will become active and trackable within 24 hours of dispatch.
            </p>
          </div>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Customs, Duties, and Taxes</h2>
          <div className="text-slate-600 space-y-4">
            <p>
              CordlessToolz is responsible for shipping your order from our distribution network to your destination. However, any external customs duties, tariffs, or local taxes applied to your order during or after transit are the sole responsibility of the customer.
            </p>
          </div>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Damages & Shipping Issues</h2>
          </div>
          <div className="space-y-4 text-slate-600">
            <p>
              CordlessToolz takes immense care in packaging your products securely. While we are not directly liable for products damaged or lost in transit by third-party carriers, your satisfaction is our priority.
            </p>
            <p>
              If your order arrives damaged, please document the damage immediately and contact the shipping carrier to file an official claim.
            </p>
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-800 text-sm mt-4">
              <strong>Important:</strong> Please retain all original packaging materials, boxes, and the damaged goods exactly as they arrived until your claim has been processed.
            </div>
          </div>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Returns Policy</h2>
          </div>
          <div className="text-slate-600 space-y-4">
            <p>
              Need to return an item? Our comprehensive Return & Refund Policy provides step-by-step instructions and detailed information about your options and return windows.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
