'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ArrowLeft,
  Compass,
  Trees,
  CreditCard,
  QrCode,
  WifiOff,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

interface FAQItem {
  id: string;
  category: 'calculation' | 'vehicles' | 'trees' | 'donation' | 'certificates' | 'offline';
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'calculation',
    questionEn: 'Why do mountain roads produce more carbon than flat highway driving?',
    questionHi: 'मैदानी सड़कों की तुलना में पहाड़ी रास्तों पर अधिक कार्बन क्यों उत्पन्न होता है?',
    answerEn:
      'Steep inclines, continuous gear shifting, hairpin turns, and lower oxygen levels in high altitudes force vehicle engines to consume up to 25% to 40% more fuel per kilometer compared to flat plains. Pahad Footprint automatically factors this mountain climb adjustment.',
    answerHi:
      'खड़ी चढ़ाई, लगातार गियर बदलना, तीखे मोड़ और ऊंचाई पर हवा का कम दबाव गाड़ियों के इंजन पर अतिरिक्त भार डालते हैं। इससे मैदानी सड़कों के मुकाबले 25% से 40% तक ज्यादा ईंधन जलता है। पहाड़ फुटप्रिंट इस अतिरिक्त भार की गणना अपने आप करता है।',
  },
  {
    id: 'faq-2',
    category: 'calculation',
    questionEn: 'How are the round-trip distance and mountain slope calculated?',
    questionHi: 'आने-जाने की दूरी और पहाड़ी ढलान की गणना कैसे होती है?',
    answerEn:
      'When you choose your origin and destination in Uttarakhand, our system computes the actual road distance through the mountain corridor using OpenStreetMap road network geometry, while identifying the altitude zone (Foothills, Mid-Hills, or High Altitude). There is no need to enter distances manually.',
    answerHi:
      'जब आप उत्तराखंड में अपना प्रस्थान और गंतव्य स्थान चुनते हैं, तो हमारा सिस्टम ओपनस्ट्रीटमैप सड़क नेटवर्क से वास्तविक पहाड़ी दूरी और ऊंचाई क्षेत्र (निचली पहाड़ियाँ, मध्य पहाड़ियाँ या ऊंचे पहाड़) का हिसाब अपने आप लगा लेता है। आपको हाथ से दूरी भरने की आवश्यकता नहीं है।',
  },
  {
    id: 'faq-3',
    category: 'vehicles',
    questionEn: 'Are two-wheelers like motorcycles, scooty, and bicycles supported?',
    questionHi: 'क्या मोटरसाइकिल, स्कूटी और साइकिल जैसे दोपहिया वाहन शामिल हैं?',
    answerEn:
      'Yes! You can choose between Pedal Bicycles, Electric Two-Wheelers, Petrol/Hybrid Motorcycles, and lightweight gearless Scooters. Incompatible fuel types (such as CNG, LPG, or diesel for two-wheelers) are automatically restricted.',
    answerHi:
      'हाँ! आप पैडल साइकिल, इलेक्ट्रिक दोपहिया, पेट्रोल/हाइब्रिड मोटरसाइकिल और गियरलेस स्कूटी में से चुन सकते हैं। अनुपयुक्त ईंधन (जैसे दोपहिया वाहनों के लिए सीएनजी, एलपीजी या डीजल) अपने आप बंद रहते हैं।',
  },
  {
    id: 'faq-4',
    category: 'trees',
    questionEn: 'Why does Pahad Footprint recommend native Himalayan Banj Oak trees?',
    questionHi: 'पहाड़ फुटप्रिंट देशी हिमालयी बांज ओक के पेड़ लगाने की सिफारिश क्यों करता है?',
    answerEn:
      'Banj Oak (Quercus leucotrichophora) is the keystone indigenous tree of Uttarakhand. Its extensive root networks anchor steep hill slopes against landslides, conserve rainwater to recharge Himalayan freshwater springs, and sustain local wildlife.',
    answerHi:
      'बांज ओक उत्तराखंड का सबसे महत्वपूर्ण देशी पेड़ है। इसकी गहरी जड़ें पहाड़ी ढलानों को भूस्खलन से बचाती हैं, बारिश का पानी रोककर प्राकृतिक जलधाराओं को जीवित रखती हैं और स्थानीय वन्यजीवों को भोजन व आश्रय देती हैं।',
  },
  {
    id: 'faq-5',
    category: 'donation',
    questionEn: 'What if I cannot physically plant trees myself during my journey?',
    questionHi: 'यदि मैं अपनी यात्रा के दौरान स्वयं पौधे नहीं लगा सकता तो क्या विकल्प है?',
    answerEn:
      'You can donate the equivalent amount (₹120 per sapling) to certified Himalayan conservation NGOs and community Van Panchayats. Village nurseries will grow, plant, geotag, and nurture the saplings for 2 years on your behalf.',
    answerHi:
      'आप प्रमाणित हिमालयी संरक्षण एनजीओ व वन पंचायतों को समतुल्य राशि (₹120 प्रति पौधा) दान कर सकते हैं। स्थानीय ग्रामीण नर्सरी आपकी ओर से पौधे उगाकर उन्हें रोपेंगी और २ साल तक उनकी देखभाल करेंगी।',
  },
  {
    id: 'faq-6',
    category: 'certificates',
    questionEn: 'How does the Recognition Certificate and QR code verification work?',
    questionHi: 'सम्मान प्रमाण पत्र और क्यूआर कोड सत्यापन कैसे काम करता है?',
    answerEn:
      'After pledging saplings or contributing to an NGO, an official Certificate of Mountain Stewardship is generated with your name and tree count. The embedded QR code directly links to our public Verification Registry where anyone can confirm its authenticity.',
    answerHi:
      'पौधारोपण का संकल्प लेने अथवा एनजीओ में योगदान करने के बाद, आपके नाम और पेड़ों की संख्या के साथ आधिकारिक प्रमाण पत्र बनता है। इसमें लगा क्यूआर कोड सीधे हमारी सत्यापन रजिस्ट्री से जुड़ा होता है जहां कोई भी इसे सत्यापित कर सकता है।',
  },
  {
    id: 'faq-7',
    category: 'certificates',
    questionEn: 'Can I print or save my certificate without printing the whole webpage?',
    questionHi: 'क्या मैं पूरे वेबपेज के बिना केवल अपना प्रमाण पत्र प्रिंट या सेव कर सकता हूँ?',
    answerEn:
      'Yes! Clicking the "Print / Save Certificate" button isolates only the certificate frame into an A4 print document. You can save it directly as a clean PDF or print it on paper.',
    answerHi:
      'हाँ! "सर्टिफिकेट प्रिंट / सेव करें" बटन पर क्लिक करने से केवल प्रमाण पत्र ही अलग होकर A4 प्रिंट रूप में आता है। आप इसे सीधे स्वच्छ पीडीएफ के रूप में सहेज सकते हैं या प्रिंट निकाल सकते हैं।',
  },
  {
    id: 'faq-8',
    category: 'offline',
    questionEn: 'Does the application work offline in remote mountain areas?',
    questionHi: 'क्या यह ऐप पहाड़ों में बिना इंटरनेट (ऑफलाइन) काम करता है?',
    answerEn:
      'Yes! Pahad Footprint is built as an Offline Progressive Web App (PWA). Once loaded, map data, carbon calculations, and mountain guides remain cached on your device even when cellular networks are unavailable in high mountain valleys.',
    answerHi:
      'हाँ! पहाड़ फुटप्रिंट एक ऑफलाइन प्रोग्रेसिव वेब ऐप (PWA) है। एक बार लोड होने के बाद, मैप डेटा, कार्बन गणना और पहाड़ी गाइड आपके डिवाइस पर सुरक्षित रहते हैं, भले ही ऊंचाई पर इंटरनेट नेटवर्क न हो।',
  },
];

export default function FAQPage() {
  const { language } = useTranslation();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const categories = [
    { id: 'all', labelEn: 'All Questions', labelHi: 'सभी प्रश्न' },
    { id: 'calculation', labelEn: '🏔️ Mountain Slope', labelHi: '🏔️ पहाड़ी ढलान' },
    { id: 'vehicles', labelEn: '🚗 Vehicles & Bikes', labelHi: '🚗 वाहन एवं बाइक' },
    { id: 'trees', labelEn: '🌲 Tree Planting', labelHi: '🌲 पौधारोपण' },
    { id: 'donation', labelEn: '💳 NGO Donations', labelHi: '💳 एनजीओ दान' },
    { id: 'certificates', labelEn: '📜 Certificates & QR', labelHi: '📜 प्रमाण पत्र व QR' },
    { id: 'offline', labelEn: '📶 Offline & Privacy', labelHi: '📶 ऑफलाइन एवं गोपनीयता' },
  ];

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      item.questionEn.toLowerCase().includes(query) ||
      item.questionHi.toLowerCase().includes(query) ||
      item.answerEn.toLowerCase().includes(query) ||
      item.answerHi.toLowerCase().includes(query);

    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-[880px] 2xl:max-w-[1040px] mx-auto py-6 space-y-8">
      {/* Back Link */}
      <div>
        <Link href="/" className="text-link text-[12px] font-mono inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'HI' ? '← मुख्य पृष्ठ पर वापस जाएं' : '← Back to Home'}</span>
        </Link>
      </div>

      {/* Header */}
      <div className="pb-4 border-b space-y-2" style={{ borderColor: 'var(--line)' }}>
        <h1 className="text-[28px] sm:text-[36px] font-bold text-[#242722] tracking-tight">
          {language === 'HI' ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#51554D] max-w-2xl leading-relaxed">
          {language === 'HI'
            ? 'पहाड़ी यात्रा, वृक्षारोपण, प्रमाण पत्र और ऑफलाइन उपयोग से जुड़े सामान्य प्रश्नों के सरल उत्तर।'
            : 'Simple answers to common questions about hill travel fuel, native tree planting, certificates, and offline use.'}
        </p>
      </div>

      {/* Search Input */}
      <div className="journal-card p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777C72]" />
          <input
            type="text"
            placeholder={
              language === 'HI'
                ? 'प्रश्नों में खोजें (उदा. ढलान, प्रमाण पत्र, पेड़, ऑफलाइन)...'
                : 'Search questions (e.g. slope, certificates, trees, offline, NGO)...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-[#2D322B29] rounded text-[13.5px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded text-[12px] font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat.id
                ? 'bg-[#304B38] text-white border-[#304B38] shadow-2xs'
                : 'bg-white text-[#51554D] border-[#2D322B29] hover:bg-[#F0EEE6] hover:text-[#242722]'
            }`}
          >
            {language === 'HI' ? cat.labelHi : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="journal-card p-12 text-center text-[#777C72] font-mono text-[13px]">
            {language === 'HI' ? 'कोई प्रश्न नहीं मिला।' : 'No questions match your search query.'}
          </div>
        ) : (
          filteredItems.map((item) => {
            const isOpen = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="journal-card p-0 overflow-hidden transition-all duration-200 border"
                style={{
                  borderColor: isOpen ? '#496951' : 'var(--line)',
                  backgroundColor: isOpen ? '#FAF9F5' : 'var(--paper-card)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : item.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-semibold text-[14px] sm:text-[15px] text-[#242722] hover:text-[#304B38] transition-colors"
                >
                  <span className="leading-snug">
                    {language === 'HI' ? item.questionHi : item.questionEn}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-[#777C72]"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                    >
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-[13px] text-[#51554D] leading-relaxed border-t border-[#2D322B14]">
                        <p>{language === 'HI' ? item.answerHi : item.answerEn}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Need more help banner */}
      <div className="journal-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-[15px] text-[#242722]">
            {language === 'HI' ? 'क्या आपका कोई अन्य प्रश्न है?' : 'Still have questions?'}
          </h3>
          <p className="text-[12.5px] text-[#51554D] mt-0.5">
            {language === 'HI'
              ? 'हमारी उत्तराखंड फील्ड टीम आपकी सहायता के लिए सदैव उपलब्ध है।'
              : 'Our field coordinator team in Dehradun and Almora is ready to help.'}
          </p>
        </div>

        <Link
          href="/contact"
          className="button-primary py-2.5 px-4 rounded text-[12.5px] font-bold whitespace-nowrap shadow-xs"
        >
          {language === 'HI' ? 'हमसे संपर्क करें →' : 'Contact Support Desk →'}
        </Link>
      </div>
    </div>
  );
}
