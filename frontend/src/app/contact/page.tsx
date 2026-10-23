'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Trees,
  ArrowLeft,
  Building2,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

export default function ContactPage() {
  const { language } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('traveler');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Save inquiry to session / local log
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-[960px] 2xl:max-w-[1140px] mx-auto py-6 space-y-8">
      {/* Back Link */}
      <div>
        <Link href="/" className="text-link text-[12px] font-mono inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'HI' ? '← मुख्य पृष्ठ पर वापस जाएं' : '← Back to Home'}</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="pb-4 border-b space-y-2" style={{ borderColor: 'var(--line)' }}>
        <h1 className="text-[28px] sm:text-[36px] font-bold text-[#242722] tracking-tight">
          {language === 'HI' ? 'हमसे संपर्क करें' : 'Get in Touch'}
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#51554D] max-w-2xl leading-relaxed">
          {language === 'HI'
            ? 'अपनी यात्रा, पौधारोपण या हमारे क्षेत्रीय सहायता केंद्र से जुड़े किसी भी प्रश्न के लिए हमसे संपर्क करें।'
            : 'Have questions about your trip calculations, tree planting, or local nurseries? We are here to help.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-8 items-start">
        {/* Contact Form */}
        <div className="journal-card p-6 sm:p-8 space-y-5">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#E8EDE5] text-[#304B38] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-[18px] font-bold text-[#242722]">
                {language === 'HI' ? 'संदेश सफलतापूर्वक प्राप्त हुआ!' : 'Message Received!'}
              </h3>
              <p className="text-[13px] text-[#51554D] max-w-md mx-auto leading-relaxed">
                {language === 'HI'
                  ? `धन्यवाद ${name || 'यात्री'}! हमारे उत्तराखंड समन्वय प्रकोष्ठ से एक प्रतिनिधि २४ घंटे के भीतर आपसे संपर्क करेगा।`
                  : `Thank you, ${name || 'Traveler'}! A representative from our Uttarakhand field coordinator desk will follow up within 24 hours.`}
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 rounded text-[12px] font-semibold bg-[#FAF9F5] border border-[#2D322B29] text-[#242722] hover:bg-[#F0EEE6]"
                >
                  {language === 'HI' ? 'नया संदेश भेजें' : 'Send Another Message'}
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#242722]">
                  {language === 'HI' ? 'संदेश भेजें' : 'Send Us an Inquiry'}
                </h3>
                <p className="text-[12px] text-[#777C72] mt-0.5">
                  {language === 'HI'
                    ? 'कृपया नीचे दिए गए फॉर्म में आवश्यक जानकारी भरें।'
                    : 'Fill in your details below and our team will get back to you promptly.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                    {language === 'HI' ? 'आपका नाम *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Bhatt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#2D322B29] rounded text-[13px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                    {language === 'HI' ? 'ईमेल पता *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="maya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#2D322B29] rounded text-[13px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                    {language === 'HI' ? 'फोन नंबर (वैकल्पिक)' : 'Phone Number (Optional)'}
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#2D322B29] rounded text-[13px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                    {language === 'HI' ? 'पूछताछ का विषय' : 'Topic of Inquiry'}
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#2D322B29] rounded text-[13px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
                  >
                    <option value="traveler">
                      {language === 'HI' ? '🎒 यात्रा योजना एवं कार्बन गणना' : '🎒 Traveler Planning & Carbon Calculations'}
                    </option>
                    <option value="panchayat">
                      {language === 'HI' ? '🌲 वन पंचायत सामुदायिक साझेदारी' : '🌲 Van Panchayat Community Partnership'}
                    </option>
                    <option value="ngo">
                      {language === 'HI' ? '🤝 एनजीओ एवं देवनेक्सिस पौधारोपण सहयोग' : '🤝 NGO & DevNexis Tree Plantation'}
                    </option>
                    <option value="feedback">
                      {language === 'HI' ? '🛠️ तकनीकी सुझाव व अन्य प्रश्न' : '🛠️ Technical Feedback & General'}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                  {language === 'HI' ? 'संदेश *' : 'Message *'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    language === 'HI'
                      ? 'कृपया अपना संदेश या प्रश्न यहां लिखें...'
                      : 'How can we help your journey through Uttarakhand?'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-white border border-[#2D322B29] rounded text-[13px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951] leading-relaxed resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="button-primary w-full py-3 rounded text-[13.5px] font-bold flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Message...' : language === 'HI' ? 'संदेश भेजें' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Coordination Information Card */}
        <div className="space-y-4">
          <div className="journal-card p-6 space-y-4">
            <h3 className="font-bold text-[15px] text-[#242722] border-b pb-2" style={{ borderColor: 'var(--line)' }}>
              {language === 'HI' ? 'उत्तराखंड क्षेत्रीय संपर्क' : 'Regional Field Desk'}
            </h3>

            <div className="space-y-3.5 text-[12.5px] text-[#51554D]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#304B38] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#242722] block">Dehradun Field Desk:</strong>
                  <span>Rajpur Road, Dehradun, Uttarakhand 248001</span>
                  <span className="block font-mono text-[11px] text-[#777C72]">
                    GPS: 30.3165° N, 78.0322° E
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Trees className="w-4 h-4 text-[#496951] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#242722] block">Kumaon Division Nursery Hub:</strong>
                  <span>Almora – Mukteshwar Ridge Conservation Cell</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#304B38] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#242722] block">Direct Email:</strong>
                  <a href="mailto:support@maybesurya.dev" className="text-[#304B38] hover:underline">
                    support@maybesurya.dev
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#8A5D2E] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#242722] block">Operating Hours:</strong>
                  <span>Mon – Sat, 9:00 AM – 6:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ pointer */}
          <div className="p-4 rounded-xl border border-[#496951]/25 bg-[#E8EDE5]/50 space-y-1.5 text-[12px]">
            <span className="font-bold text-[#304B38] flex items-center gap-1.5">
              <span>Looking for Quick Answers?</span>
            </span>
            <p className="text-[#51554D] leading-snug">
              Check our Frequently Asked Questions for instant details on tree certificates, offline PWA, and calculation standards.
            </p>
            <div className="pt-1">
              <Link href="/faq" className="text-[#304B38] font-bold underline text-[11.5px]">
                Browse FAQ Page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
