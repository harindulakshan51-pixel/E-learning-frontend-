import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f7fa] py-20 px-6 md:px-12 xl:px-16">
      <div className="max-w-[1700px] mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#0a1961] px-10 py-16 text-white">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-6 h-0.5 bg-orange-400"></div>
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-white/90">
                LEGAL & COMPLIANCE
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Privacy Policy</h1>
            <p className="text-white/80 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className="p-10 md:p-16 w-full">
            
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">1. Introduction</h2>
              <p className="text-slate-600 mb-4 leading-relaxed text-lg">
                Welcome to Scholarly. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our 
                website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">2. The Data We Collect About You</h2>
              <p className="text-slate-600 mb-4 leading-relaxed text-lg">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-3 text-lg">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                <li><strong>Profile Data:</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">3. How We Use Your Personal Data</h2>
              <p className="text-slate-600 mb-4 leading-relaxed text-lg">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-3 text-lg">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">4. Data Security</h2>
              <p className="text-slate-600 mb-4 leading-relaxed text-lg">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">5. Your Legal Rights</h2>
              <p className="text-slate-600 mb-4 leading-relaxed text-lg">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-3 text-lg">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">6. Contact Us</h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                If you have any questions about this privacy policy or our privacy practices, please contact us.
              </p>
              <button 
                onClick={() => navigate('/contact')}
                className="bg-[#0a1961] text-white px-8 py-3.5 rounded-lg font-bold text-base hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
              >
                Contact Support
              </button>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
