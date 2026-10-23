'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Trees,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

interface RecognitionCertificateProps {
  travelerName: string;
  treeCount: number;
  species?: string;
  location?: string;
  isDonation?: boolean;
  donationAmount?: number;
  certificateId?: string;
  onClose?: () => void;
}

export const RecognitionCertificate: React.FC<RecognitionCertificateProps> = ({
  travelerName = 'Himalayan Traveler',
  treeCount,
  species = 'Himalayan Banj Oak (Quercus leucotrichophora)',
  location = 'Uttarakhand Van Panchayat Community Land',
  isDonation = false,
  donationAmount,
  certificateId = `UK-VP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
  onClose,
}) => {
  const { language } = useTranslation();
  const certRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Date().toLocaleDateString(
    language === 'HI' ? 'hi-IN' : 'en-IN',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  // Payload encoded into the QR Code via MaybeSurya QrX API
  const qrVerificationText = `https://pahadfootprint.in/verify?cert=${certificateId}&trees=${treeCount}&name=${encodeURIComponent(
    travelerName
  )}&date=${encodeURIComponent(formattedDate)}`;

  // MaybeSurya QrX API endpoint: https://qrgen.maybesurya.dev/api/qrgen?data=...
  const qrCodeUrl = `https://qrgen.maybesurya.dev/api/qrgen?data=${encodeURIComponent(
    qrVerificationText
  )}`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pahad Footprint Tree Pledge Certificate`,
          text: `I just pledged ${treeCount} native Banj Oak trees for Himalayan mountain restoration in Uttarakhand! Certificate: ${certificateId}`,
          url: qrVerificationText,
        });
      } catch {
        // User cancelled share
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(qrVerificationText);
      alert(language === 'HI' ? 'सत्यापन लिंक कॉपी हो गया!' : 'Certificate link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Certificate Frame */}
      <div
        ref={certRef}
        className="p-6 sm:p-8 rounded-xl border-2 shadow-elevated relative overflow-hidden bg-[#FAF9F5] print:p-8 print:border-black"
        style={{
          borderColor: 'var(--line-strong)',
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(247, 246, 240, 0.8) 0%, rgba(240, 238, 230, 0.6) 100%)',
        }}
      >
        {/* Archival corner decorations */}
        <span className="absolute top-3 left-3 text-[14px] text-[#496951] font-mono select-none">✦</span>
        <span className="absolute top-3 right-3 text-[14px] text-[#496951] font-mono select-none">✦</span>
        <span className="absolute bottom-3 left-3 text-[14px] text-[#496951] font-mono select-none">✦</span>
        <span className="absolute bottom-3 right-3 text-[14px] text-[#496951] font-mono select-none">✦</span>

        {/* Certificate Inner Border */}
        <div className="border border-[#496951]/25 rounded-lg p-5 sm:p-7 relative z-10 space-y-5 text-center">
          {/* Header & Seal */}
          <div className="flex flex-col items-center space-y-2">
            <div
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: 'var(--green-pale)',
                borderColor: 'var(--green-deep)',
                color: 'var(--green-deep)',
              }}
            >
              <Trees className="w-6 h-6 text-[#304B38]" />
            </div>

            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-widest text-[#496951] font-bold block">
                {language === 'HI' ? 'उत्तराखंड वन संरक्षण संकल्प' : 'HIMALAYAN FOREST STEWARDSHIP'}
              </span>
              <h2 className="text-[20px] sm:text-[26px] font-bold text-[#242722] tracking-tight mt-0.5">
                {language === 'HI' ? 'प्रकृति संरक्षण सम्मान प्रमाण पत्र' : 'Certificate of Mountain Stewardship'}
              </h2>
              <p className="text-[11.5px] text-[#777C72] font-mono">
                Van Panchayat Community Conservation Initiative · Uttarakhand
              </p>
            </div>
          </div>

          {/* Award Text */}
          <div className="space-y-2 py-2">
            <p className="text-[12px] sm:text-[13px] text-[#51554D] italic">
              {language === 'HI'
                ? 'यह प्रमाणित किया जाता है कि पर्यावरण के प्रति समर्पित यात्री'
                : 'This certificate of recognition is warmly presented to'}
            </p>

            <div className="border-b-2 border-[#304B38]/30 pb-1.5 inline-block min-w-[240px]">
              <span className="text-[20px] sm:text-[24px] font-bold text-[#242722] tracking-tight">
                {travelerName || (language === 'HI' ? 'पहाड़ी यात्री' : 'Himalayan Traveler')}
              </span>
            </div>

            <p className="text-[12px] sm:text-[13px] text-[#51554D] max-w-lg mx-auto pt-1 leading-relaxed">
              {isDonation
                ? (language === 'HI'
                    ? `ने हिमालयी वनों के पुनर्जीवन हेतु प्रमाणित एनजीओ के माध्यम से ${treeCount} देशी बांज ओक के पेड़ों का सहयोग राशि (₹${donationAmount || treeCount * 120}) देकर संरक्षण सुनिश्चित किया है।`
                    : `has sponsored ${treeCount} native Himalayan Banj Oak trees through certified conservation NGOs, funding sapling nursery care, plantation, and 2-year survival protection.`)
                : (language === 'HI'
                    ? `ने उत्तराखंड की यात्रा के दौरान प्रकृति संतुलन बनाए रखने हेतु ${treeCount} देशी बांज ओक के पौधे रोपने का पवित्र संकल्प लिया है।`
                    : `has officially pledged to plant ${treeCount} indigenous Himalayan Banj Oak saplings to stabilize mountain slopes, prevent erosion, and recharge freshwater springs.`)}
            </p>
          </div>

          {/* Species & Tree Counter Box */}
          <div className="p-3.5 rounded-lg border border-[#496951]/20 bg-[#E8EDE5]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#304B38] text-white flex items-center justify-center flex-shrink-0 font-bold font-mono text-[14px]">
                {treeCount}
              </div>
              <div>
                <span className="text-[13px] font-bold text-[#242722] block leading-snug">
                  {treeCount} {species}
                </span>
                <span className="text-[11px] text-[#51554D] block">
                  📍 {location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#304B38] font-bold bg-white px-2.5 py-1 rounded border border-[#496951]/25">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'सत्यापित संकल्प' : 'Verified Pledge'}</span>
            </div>
          </div>

          {/* Footer Metadata & QrX Live QR Code */}
          <div className="pt-3 border-t border-[#2D322B14] flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left metadata */}
            <div className="text-left font-mono text-[11px] space-y-1">
              <div>
                <span className="text-[#777C72]">Certificate ID: </span>
                <span className="font-bold text-[#242722]">{certificateId}</span>
              </div>
              <div>
                <span className="text-[#777C72]">Date Issued: </span>
                <span className="text-[#242722]">{formattedDate}</span>
              </div>
              <div className="text-[10px] text-[#496951] font-semibold">
                Van Panchayat Joint Forest Management (JFM) Council
              </div>
            </div>

            {/* Right: MaybeSurya QrX Generated QR Code */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-[#2D322B1F] shadow-xs">
              <div className="relative w-16 h-16 rounded overflow-hidden flex items-center justify-center bg-[#FAF9F5]">
                {/* Embedded QR Code from MaybeSurya QrX API */}
                <img
                  src={qrCodeUrl}
                  alt={`QR Verification Code for certificate ${certificateId}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to text icon if network is offline in hills
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="text-left text-[10px] font-mono">
                <span className="font-bold text-[#242722] block flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-[#304B38]" />
                  <span>Scan to Verify</span>
                </span>
                <span className="text-[#777C72] block leading-tight mt-0.5">
                  Live verification via
                </span>
                <a
                  href="https://docs.maybesurya.dev/qrx/introduction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#304B38] font-bold hover:underline inline-flex items-center gap-0.5 mt-0.5"
                >
                  <span>MaybeSurya QrX</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Print, Share & Done */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded text-[12px] font-semibold bg-white border border-[#2D322B29] text-[#242722] hover:bg-[#F0EEE6] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#496951]" />
            <span>{language === 'HI' ? 'सर्टिफिकेट प्रिंट / सेव करें' : 'Print / Save Certificate'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-2 rounded text-[12px] font-semibold bg-white border border-[#2D322B29] text-[#242722] hover:bg-[#F0EEE6] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B3834D]" />
            <span>{language === 'HI' ? 'शेयर करें' : 'Share'}</span>
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="button-primary px-4 py-2 text-[12px] font-bold rounded"
          >
            <span>{language === 'HI' ? 'पूर्ण' : 'Done'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
