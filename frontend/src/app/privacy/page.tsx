'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  WifiOff,
  Trees,
  EyeOff,
  FileText,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

export default function PrivacyPage() {
  const { language } = useTranslation();

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
          {language === 'HI' ? 'गोपनीयता नीति' : 'Privacy Policy'}
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#51554D] max-w-2xl leading-relaxed">
          {language === 'HI'
            ? 'पहाड़ फुटप्रिंट आपकी यात्रा की गणना और जानकारी को पूरी तरह आपके फोन या कंप्यूटर पर निजी रखता है।'
            : 'How Pahad Footprint keeps your travel calculations and information private on your device.'}
        </p>
      </div>

      {/* Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="journal-card p-4 space-y-2">
          <div className="w-8 h-8 rounded bg-[#E8EDE5] text-[#304B38] flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[14px] text-[#242722]">
            {language === 'HI' ? '१००% निजी गणना' : '100% Client-Side Private'}
          </h3>
          <p className="text-[12px] text-[#51554D] leading-relaxed">
            {language === 'HI'
              ? 'आपकी यात्रा मार्ग की गणना केवल आपके ब्राउज़र में होती है। आपका जीपीएस या रूट हिस्ट्री सर्वर पर नहीं भेजी जाती।'
              : 'Trip routes, elevation factors, and emissions are calculated directly in your browser. No route history is uploaded.'}
          </p>
        </div>

        <div className="journal-card p-4 space-y-2">
          <div className="w-8 h-8 rounded bg-[#E8EDE5] text-[#304B38] flex items-center justify-center">
            <WifiOff className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[14px] text-[#242722]">
            {language === 'HI' ? 'ऑफलाइन डेटा नियंत्रण' : 'Offline Device Cache'}
          </h3>
          <p className="text-[12px] text-[#51554D] leading-relaxed">
            {language === 'HI'
              ? 'पहाड़ों में बिना इंटरनेट काम करने के लिए मौसम और मैप केवल आपके फोन के लोकल स्टोरेज में सुरक्षित रहते हैं।'
              : 'Offline maps and hill weather caches reside on your device. You can clear your local cache at any time.'}
          </p>
        </div>

        <div className="journal-card p-4 space-y-2">
          <div className="w-8 h-8 rounded bg-[#E8EDE5] text-[#304B38] flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-[14px] text-[#242722]">
            {language === 'HI' ? 'विज्ञापन व ट्रैकिंग मुक्त' : 'Zero Ads & Zero Tracking'}
          </h3>
          <p className="text-[12px] text-[#51554D] leading-relaxed">
            {language === 'HI'
              ? 'हम कभी भी आपका डेटा विज्ञापनदाताओं को नहीं बेचते। कोई भी स्पैम या छिपे हुए कुकीज नहीं हैं।'
              : 'We do not monetize, sell, or profile traveler data. No cross-site marketing trackers or third-party ad networks.'}
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="journal-card p-6 sm:p-8 space-y-7 text-[13px] leading-relaxed text-[#51554D]">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-[16px] font-bold text-[#242722] flex items-center gap-2">
            <span className="font-mono text-[#304B38]">01.</span>
            <span>{language === 'HI' ? 'हम कौन सी जानकारी एकत्र करते हैं' : 'Information We Handle'}</span>
          </h2>
          <p>
            {language === 'HI'
              ? 'पहाड़ फुटप्रिंट एक प्रकृति-जागरूक फील्ड गाइड है। सामान्य यात्रा गणना के लिए किसी खाते या साइन-इन की आवश्यकता नहीं होती। जब आप अपनी मर्जी से पौधे लगाने का संकल्प लेते हैं या दान करते हैं, केवल तब आपके द्वारा दर्ज नाम और पौधों की संख्या को प्रमाण पत्र जारी करने हेतु वन पंचायत रिकॉर्ड में सुरक्षित किया जाता है।'
              : 'Pahad Footprint does not require account creation for trip planning. When you voluntarily submit a tree planting pledge or NGO sponsorship, only the name you specify, the tree quantity, and the unique Certificate ID are recorded in the public Van Panchayat ledger.'}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-[16px] font-bold text-[#242722] flex items-center gap-2">
            <span className="font-mono text-[#304B38]">02.</span>
            <span>{language === 'HI' ? 'तृतीय-पक्ष सेवाएं एवं एपीआई (Third-Party Services)' : 'Third-Party APIs & Privacy'}</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Himalayan Weather & AQI:</strong> Provided by MaybeSurya Weather API (
              <a href="https://docs.maybesurya.dev/weather/overview" target="_blank" rel="noopener noreferrer" className="text-[#304B38] underline">
                Himalayan Weather & AQI
              </a>
              ). Queried via mountain coordinates without transmitting personal identifiers.
            </li>
            <li>
              <strong>QR Code Verification:</strong> Generated via QrX API (
              <a href="https://qrgen.maybesurya.dev" target="_blank" rel="noopener noreferrer" className="text-[#304B38] underline">
                QR Code Generator
              </a>
              ). Only the public certificate verification URL is encoded into a visual QR graphic.
            </li>
            <li>
              <strong>NGO Donations:</strong> Processed through certified Himalayan community conservation partner. (
              <a href="https://devnexis.in/payment" target="_blank" rel="noopener noreferrer" className="text-[#304B38] underline">
                Donation Link
              </a>
              ). Pahad Footprint never accesses or stores bank account, UPI PIN, or credit card details.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-[16px] font-bold text-[#242722] flex items-center gap-2">
            <span className="font-mono text-[#304B38]">03.</span>
            <span>{language === 'HI' ? 'डेटा संप्रभुता एवं सुरक्षा कानून' : 'Compliance & Data Sovereignty'}</span>
          </h2>
          <p>
            {language === 'HI'
              ? 'यह प्लेटफॉर्म भारत के डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Act 2023) के सिद्धांतों का पालन करता है। आप किसी भी समय अपने स्थानीय कुकीज और स्टोरेज को अपने ब्राउज़र की सेटिंग से साफ कर सकते हैं।'
              : 'Pahad Footprint adheres to the principles of the Indian Digital Personal Data Protection (DPDP) Act 2023. You retain full sovereignty over your cached trips and may purge local data at any time via your browser settings.'}
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-[16px] font-bold text-[#242722] flex items-center gap-2">
            <span className="font-mono text-[#304B38]">04.</span>
            <span>{language === 'HI' ? 'संपर्क एवं शिकायत निवारण' : 'Contact & Privacy Officer'}</span>
          </h2>
          <p>
            {language === 'HI'
              ? 'यदि आपकी गोपनीयता के संबंध में कोई प्रश्न या सुझाव हैं, तो कृपया हमारे संपर्क पृष्ठ के माध्यम से अथवा ईमेल द्वारा संपर्क करें: privacy@maybesurya.dev'
              : 'For questions regarding data practices or to request registry verification updates, please reach out via our Contact Page or email our coordinator at privacy@maybesurya.dev.'}
          </p>
        </section>
      </div>
    </div>
  );
}
