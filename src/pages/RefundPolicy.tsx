import React from 'react';
import { RefreshCcw, CreditCard, Wrench, ShieldCheck, Mail, CheckCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 md:py-32">
      <SEO 
        title="Return & Refund Policy | CordlessToolz"
        description="Learn about the CordlessToolz 90-day return policy, exchange procedures, and warranty coverage for your cordless tools and equipment." 
      />
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Return & Refund Policy</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Thank you for choosing CordlessToolz as your trusted supplier of premium cordless power and cleaning equipment. We stand behind the quality of the products we curate. If you are not completely satisfied with your purchase, we are here to help you resolve the issue efficiently.
        </p>
      </div>

      <div className="space-y-12">
        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">90-Day Return & Exchange Window</h2>
          </div>
          <p className="text-slate-600 mb-6">
            We accept returns and exchange requests within <strong>90 days</strong> of your delivery date. To be eligible for a standard return or exchange, your item must meet the following criteria:
          </p>
          <ul className="space-y-3 text-slate-600 list-disc list-inside">
            <li>The product must be in <strong>unused, pristine condition</strong>.</li>
            <li>The product must be in its <strong>original, unaltered packaging</strong> with all included accessories, manuals, and components.</li>
            <li>You must provide a valid receipt or <strong>proof of purchase</strong> (such as your CordlessToolz order number or invoice).</li>
          </ul>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Initiate a Return</h2>
          <p className="text-slate-600 mb-6">
            To ensure your return is tracked and processed without delay, please follow this procedure:
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> Contact Support</h3>
                <p className="text-slate-600">Email our customer care team at <strong>support@cordlesstoolz.com</strong> before shipping any items back.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-slate-400" /> Receive Authorization</h3>
                <p className="text-slate-600">We will provide you with a Return Merchandise Authorization (RMA) and the designated return shipping address for your region.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><Package className="w-4 h-4 text-slate-400" /> Ship the Item</h3>
                <p className="text-slate-600">Please package the item securely and ship it using the specific address and method provided in our confirmation email.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600">
            <strong>Note on Return Shipping Fees:</strong> For standard returns (change of mind, non-quality issues), the customer is responsible for paying the return shipping costs to our designated facility. Original shipping costs are non-refundable.
          </div>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Refunds</h2>
          </div>
          <div className="space-y-4 text-slate-600">
            <p><strong>Inspection Process:</strong> Once your return is received at our facility, our technicians will inspect the item to verify its condition. We will send you an email confirming receipt of the package.</p>
            <p><strong>Approval &amp; Processing:</strong> Following inspection, we will notify you of the approval or rejection of your refund. Approved refunds are automatically credited back to your <strong>original method of payment</strong> within a few business days, depending on your financial institution.</p>
            <p><strong>Policy Expiration:</strong> Refund requests under our 90-day policy must be completed within 90 days of initiating the claim. We cannot process refunds for non-quality issues once this 30-day window has closed.</p>
          </div>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <Wrench className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Exchanges &amp; Defective Items</h2>
          </div>
          <p className="text-slate-600 mb-6">
            We uphold strict quality standards for the inventory we supply. We replace items if they arrive defective, damaged, or experience a manufacturing failure under normal use.
          </p>
          <div className="space-y-4 text-slate-600">
            <p><strong>Exclusion Criteria:</strong> We cannot process free exchanges or replacements for items that show signs of product misuse, abuse, commercial negligence, accidental damage, unauthorized repairs/alterations, or a clear lack of required maintenance.</p>
            <p><strong>Troubleshooting Support:</strong> If your equipment is not functioning as expected, contact our technical support team at <strong>support@cordlesstoolz.com</strong>. Our experts will guide you through quick diagnostics to determine the issue.</p>
            <p><strong>Manufacturing Defects:</strong> If our team confirms a verified manufacturing fault, we will expedite a <strong>free replacement</strong> to you at no additional cost.</p>
          </div>
        </section>

        <section className="bg-white p-8 md:p-10 rounded-3xl premium-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">3-Year Limited Warranty</h2>
          </div>
          <div className="text-slate-600 space-y-4">
            <p>
              To give you complete peace of mind on your investment, CordlessToolz backs your purchase with a <strong>3-year limited warranty</strong> protecting against manufacturing defects in materials and workmanship. For full terms and coverage details, please review our comprehensive <Link to="#" className="text-orange-600 font-bold hover:underline">Warranty Page</Link>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
