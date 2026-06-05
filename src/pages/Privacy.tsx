import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { SEO } from '../components/SEO';

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 md:py-32">
      <SEO 
        title="Privacy Policy | CordlessToolz"
        description="Read the official CordlessToolz Privacy Policy. Learn about our commitment to secure cryptography, cookies usage, and digital privacy safeguards." 
      />
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Privacy Policy</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          At CordlessToolz, we respect your privacy and are committed to protecting your personal data.
        </p>
      </div>

      <div className="space-y-12">
        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Information We Collect</h2>
          </div>
          <p className="text-slate-600 mb-6">
            We collect information when you register on our site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form.
          </p>
          <ul className="space-y-3 text-slate-600 list-disc list-inside">
            <li><strong>Personal Information:</strong> Name, email address, mailing address, phone number.</li>
            <li><strong>Payment Information:</strong> We do not store your credit card information on our servers; it is securely processed by our payment partners.</li>
            <li><strong>Usage Data:</strong> Information on how you interact with our website to improve our services.</li>
          </ul>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">How We Use Your Information</h2>
          </div>
          <p className="text-slate-600 mb-6">
            Any of the information we collect from you may be used in one of the following ways:
          </p>
          <ul className="space-y-3 text-slate-600 list-disc list-inside">
            <li>To process transactions quickly and securely.</li>
            <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
            <li>To improve our website in order to better serve you.</li>
            <li>To send periodic emails regarding your order or other products and services.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
