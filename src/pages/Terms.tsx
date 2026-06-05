import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

export function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 md:py-32">
      <SEO 
        title="Terms of Service | CordlessToolz"
        description="Review the complete CordlessToolz Terms of service, customer responsibilities, warranty obligations, intellectual property conditions, and user rights." 
      />
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Terms of Service</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Please read these terms of service carefully before using CordlessToolz.
        </p>
      </div>

      <div className="space-y-12">
        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Conditions of Use</h2>
          </div>
          <p className="text-slate-600 mb-6">
            By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to leave the website accordingly. CordlessToolz only grants use and access of this website, its products, and its services to those who have accepted its terms.
          </p>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Privacy Policy</h2>
          </div>
          <p className="text-slate-600 mb-6">
            Before you continue using our website, we advise you to read our privacy policy regarding our user data collection. It will help you better understand our practices.
          </p>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Intellectual Property</h2>
          <p className="text-slate-600">
            You agree that all materials, products, and services provided on this website are the property of CordlessToolz, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property. 
          </p>
        </section>
      </div>
    </div>
  );
}
