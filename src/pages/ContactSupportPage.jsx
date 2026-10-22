import { useState } from "react";

export default function ContactSupportPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (form.name && form.email && form.message) {
      setSubmitted(true);
    }
  };

  const faqs = [
    { q: "How do I get a refund?", a: "Refund requests must be submitted within 7 days of purchase, provided you have not completed more than 20% of the course. Contact us with your order ID." },
    { q: "Can I access courses offline?", a: <>{"Currently, "}<span className="text-brand">learnbridge</span>{" does not support offline access. All course content is streamed online. We are working on an offline mode for mobile."}</> },
    { q: "How do I become an instructor?", a: "Visit the Instructors page and click 'Apply to Teach'. Our team reviews applications within 5–7 business days." },
    { q: "Is my payment information secure?", a: <>{"Yes. All payments are processed through PCI-DSS compliant payment gateways. "}<span className="text-brand">learnbridge</span>{" does not store your card details."}</> },
  ];

  const channels = [
    {
      icon: <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
      label: "Email",
      value: "support@scholarly.com",
      sub: "We reply within 24 hours",
    },
    {
      icon: <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
      label: "Live Chat",
      value: "Available Mon–Fri",
      sub: "9:00 AM – 6:00 PM (GMT+5:30)",
    },
    {
      icon: <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
      label: "Community",
      value: "Join our Discord",
      sub: "10,000+ members worldwide",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f9f9f9]">
      {/* Hero */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 pt-4 sm:pt-8 w-full">
        <div className="relative overflow-hidden bg-gradient-to-br from-accent via-accent to-accent rounded-2xl md:rounded-[32px] px-5 py-10 sm:px-8 sm:py-14 md:px-16 md:py-20 shadow-lg text-center md:text-left">
          <div className="absolute -top-24 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-[11px] font-bold tracking-[0.1em] uppercase px-3.5 py-1.5 rounded-full mb-4 sm:mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              Support
            </div>
            <h1 className="text-2xl min-[480px]:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
              How can we help?
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-lg">
              Our team is here to make your <span className="text-white font-semibold">learnbridge</span> experience exceptional.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 py-8 sm:py-12 w-full">
        {/* Contact channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {channels.map((c, i) => (
            <div key={i} className={`bg-white border border-slate-200 rounded-2xl sm:rounded-[24px] p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-shadow ${i === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-accent-50 text-accent flex items-center justify-center mx-auto mb-4 sm:mb-6">
                {c.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">{c.label}</h3>
              <div className="text-sm sm:text-base font-semibold text-accent mb-1 sm:mb-2">{c.value}</div>
              <p className="text-xs sm:text-sm text-slate-500">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Main 2-col */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Contact form */}
          <div className="bg-white border border-slate-200 rounded-2xl md:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Message Sent!</h2>
                <p className="text-slate-600 text-sm sm:text-base">Thanks for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Send us a message</h2>
                <p className="text-slate-500 text-xs sm:text-sm mb-6 sm:mb-8">Fill in the form and we'll get back to you as soon as possible.</p>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 sm:mb-2">Full Name</label>
                    <input required className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400 text-sm" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 sm:mb-2">Email Address</label>
                    <input required className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400 text-sm" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 sm:mb-2">Subject</label>
                    <input className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400 text-sm" name="subject" placeholder="What's this about?" value={form.subject} onChange={handleChange} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 sm:mb-2">Message</label>
                    <textarea required className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400 min-h-[120px] sm:min-h-[150px] resize-y text-sm" name="message" placeholder="Describe your issue or question..." value={form.message} onChange={handleChange} />
                  </div>

                  <button type="submit" className="w-full bg-accent hover:bg-accent text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer text-base">
                    Send Message →
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="bg-white border border-slate-200 rounded-2xl md:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-sm h-fit">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Frequently Asked</h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-6 sm:mb-8">Quick answers to common questions.</p>
            
            <div className="space-y-4 sm:space-y-6">
              {faqs.map((f, i) => (
                <div key={i} className={`pb-4 sm:pb-6 ${i !== faqs.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <h3 className="flex items-start gap-2.5 sm:gap-3 text-sm sm:text-base font-bold text-slate-900 mb-1.5 sm:mb-2">
                    <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded bg-accent-100 text-accent text-xs font-black flex items-center justify-center mt-0.5">Q</span>
                    <span>{f.q}</span>
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed sm:pl-9">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
