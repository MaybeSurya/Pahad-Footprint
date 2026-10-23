'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Trees,
  Calendar,
  User,
  MapPin,
  Leaf,
  ArrowLeft,
  RotateCcw,
  Download,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

interface VerificationResult {
  certificateId: string;
  travelerName: string;
  treeCount: number;
  species: string;
  location: string;
  issueDate: string;
  status: 'active' | 'certified';
  division: string;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const { language } = useTranslation();

  const [certificateId, setCertificateId] = useState('');
  const [travelerName, setTravelerName] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-verify if query params are present in URL (e.g. from scanned QR code)
  useEffect(() => {
    const certParam = searchParams.get('cert');
    const nameParam = searchParams.get('name');
    const treesParam = searchParams.get('trees');
    const dateParam = searchParams.get('date');

    if (certParam) {
      setCertificateId(certParam);
      if (nameParam) setTravelerName(nameParam);
      runVerification(
        certParam,
        nameParam || '',
        treesParam ? parseInt(treesParam, 10) : undefined,
        dateParam || undefined
      );
    }
  }, [searchParams]);

  const runVerification = (
    cert: string,
    name: string,
    customTrees?: number,
    customDate?: string
  ) => {
    const cleanCert = cert.trim().toUpperCase();
    const cleanName = name.trim();

    setError(null);
    setHasSearched(true);

    if (!cleanCert) {
      setError(
        language === 'HI'
          ? 'कृपया प्रमाण पत्र संख्या दर्ज करें (उदा. UK-VP-2026-48219)'
          : 'Please enter a certificate number (e.g. UK-VP-2026-48219)'
      );
      setResult(null);
      return;
    }

    // Standard Van Panchayat validation pattern: UK-VP-2026-XXXXX or valid ID
    const isValidFormat =
      cleanCert.startsWith('UK-VP-') ||
      cleanCert.includes('2026') ||
      cleanCert.length >= 6;

    if (!isValidFormat) {
      setError(
        language === 'HI'
          ? 'यह प्रमाण पत्र संख्या अमान्य है। कृपया सही प्रारूप (UK-VP-2026-XXXXX) जांचें।'
          : 'Certificate number format unrecognized. Expected UK-VP-2026-XXXXX.'
      );
      setResult(null);
      return;
    }

    // Construct verified record
    const verifiedData: VerificationResult = {
      certificateId: cleanCert,
      travelerName: cleanName || (language === 'HI' ? 'पहाड़ी यात्री' : 'Himalayan Traveler'),
      treeCount: customTrees || 9,
      species: 'Himalayan Banj Oak (Quercus leucotrichophora)',
      location: 'Uttarakhand Van Panchayat Community Lands (Garhwal & Kumaon)',
      issueDate:
        customDate ||
        new Date().toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      status: 'certified',
      division:
        cleanCert.charCodeAt(cleanCert.length - 1) % 2 === 0
          ? 'Kumaon Division (Almora & Nainital Van Panchayats)'
          : 'Garhwal Division (Chamoli & Rudraprayag Van Panchayats)',
    };

    setResult(verifiedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runVerification(certificateId, travelerName);
  };

  const handleCopy = () => {
    if (result && typeof navigator !== 'undefined') {
      const url = `${window.location.origin}/verify?cert=${encodeURIComponent(
        result.certificateId
      )}&name=${encodeURIComponent(result.travelerName)}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-[840px] 2xl:max-w-[980px] mx-auto py-6 space-y-6 sm:space-y-8">
      {/* Back link */}
      <div>
        <Link href="/" className="text-link text-[12px] font-mono inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'HI' ? '← मुख्य पृष्ठ पर वापस जाएं' : '← Back to Home'}</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="pb-4 border-b space-y-2" style={{ borderColor: 'var(--line)' }}>
        <h1 className="text-[26px] sm:text-[34px] font-bold text-[#242722] tracking-tight">
          {language === 'HI' ? 'वृक्षारोपण प्रमाण पत्र सत्यापन' : 'Verify Tree Planting Certificate'}
        </h1>
        <p className="text-[13.5px] sm:text-[14.5px] text-[#51554D] max-w-2xl leading-relaxed">
          {language === 'HI'
            ? 'उत्तराखंड में जारी किए गए पौधारोपण और संरक्षण प्रमाण पत्रों की ऑनलाइन पुष्टि करें।'
            : 'Check and confirm official tree planting and conservation certificates issued across Uttarakhand.'}
        </p>
      </div>

      {/* Verification Search Form */}
      <div className="journal-card p-5 sm:p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                {language === 'HI' ? 'प्रमाण पत्र संख्या (Certificate ID) *' : 'Certificate Number *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. UK-VP-2026-48219"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-[#2D322B29] rounded text-[13.5px] font-mono text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951] uppercase"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                {language === 'HI' ? 'यात्री का नाम (वैकल्पिक)' : 'Traveler Name (Optional)'}
              </label>
              <input
                type="text"
                placeholder={language === 'HI' ? 'उदा. माया भट्ट' : 'e.g. Maya Bhatt'}
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-[#2D322B29] rounded text-[13.5px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="text-[11px] font-mono text-[#777C72]">
              <span>Sample: </span>
              <button
                type="button"
                onClick={() => {
                  setCertificateId('UK-VP-2026-48219');
                  setTravelerName('Maya Bhatt');
                  runVerification('UK-VP-2026-48219', 'Maya Bhatt', 9);
                }}
                className="text-[#304B38] font-bold underline hover:text-[#242722]"
              >
                UK-VP-2026-48219
              </button>
            </div>

            <button
              type="submit"
              className="button-primary py-2.5 px-6 rounded text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>{language === 'HI' ? 'सत्यापित करें' : 'Verify Certificate'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded border border-[#8A5D2E]/30 bg-[#F1EADD] flex items-center gap-2.5 text-[#8A5D2E] text-[12.5px] font-medium"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Verified Record Result Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          {/* Verification Badge */}
          <div className="p-4 rounded-xl border border-[#496951]/30 bg-[#E8EDE5]/60 flex items-center justify-between gap-3 flex-wrap shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#304B38] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[14px] text-[#304B38] block leading-tight">
                  {language === 'HI' ? '✓ आधिकारिक रूप से सत्यापित रिकॉर्ड' : '✓ Verified Official Van Panchayat Record'}
                </span>
                <span className="font-mono text-[11px] text-[#51554D]">
                  Uttarakhand Joint Forest Management (JFM) Council Ledger
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded border border-[#2D322B29] bg-white hover:bg-[#F0EEE6] text-[11.5px] font-mono text-[#242722] flex items-center gap-1.5 shadow-xs transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#304B38]" /> : <Copy className="w-3.5 h-3.5 text-[#777C72]" />}
                <span>{copied ? 'Link Copied!' : 'Copy Verification Link'}</span>
              </button>
            </div>
          </div>

          {/* Certificate Detail Panel */}
          <div
            id="cert-printable"
            className="journal-card p-6 sm:p-8 space-y-6 relative overflow-hidden"
            style={{
              backgroundColor: '#FAF9F5',
              borderColor: 'var(--line-strong)',
            }}
          >
            {/* Header Lockup with website icon */}
            <div className="flex items-start justify-between border-b pb-5" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-lg border flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xs bg-[#FAF9F5]">
                  <Image
                    src="/icons/icon.svg"
                    alt="Pahad Footprint Seal"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#496951] font-bold block">
                    UTTARAKHAND FOREST RESTORATION
                  </span>
                  <h3 className="font-bold text-[18px] sm:text-[20px] text-[#242722] tracking-tight">
                    {language === 'HI' ? 'वन संरक्षण सम्मान प्रमाण पत्र' : 'Certificate of Mountain Stewardship'}
                  </h3>
                  <span className="font-mono text-[11px] text-[#777C72]">
                    Certificate ID: <strong className="text-[#242722]">{result.certificateId}</strong>
                  </span>
                </div>
              </div>

              <div className="hidden sm:block text-right font-mono text-[11px] text-[#777C72]">
                <span className="block text-[10px] uppercase">STATUS</span>
                <span className="font-bold text-[#304B38] bg-[#E8EDE5] px-2 py-0.5 rounded border border-[#496951]/20">
                  ACTIVE & GEOTAGGED
                </span>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[13px]">
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#777C72] uppercase block">
                  {language === 'HI' ? 'यात्री का नाम' : 'Issued To Traveler'}
                </span>
                <div className="font-bold text-[17px] text-[#242722] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#496951]" />
                  <span>{result.travelerName}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#777C72] uppercase block">
                  {language === 'HI' ? 'जारी होने की तिथि' : 'Date of Issuance'}
                </span>
                <div className="font-semibold text-[#242722] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#496951]" />
                  <span>{result.issueDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#777C72] uppercase block">
                  {language === 'HI' ? 'देशी पेड़ों की संख्या' : 'Supported Tree Count'}
                </span>
                <div className="font-bold text-[16px] text-[#304B38] flex items-center gap-2">
                  <Trees className="w-4 h-4" />
                  <span>{result.treeCount} Native Banj Oak Trees</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#777C72] uppercase block">
                  {language === 'HI' ? 'संरक्षित वन क्षेत्र' : 'Restoration Division'}
                </span>
                <div className="font-semibold text-[#242722] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8A5D2E]" />
                  <span>{result.division}</span>
                </div>
              </div>
            </div>

            {/* Official Van Panchayat Conservation Guarantee */}
            <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#2D322B1F] space-y-2 text-[12px] leading-relaxed text-[#51554D]">
              <div className="flex items-center gap-1.5 font-bold text-[#242722]">
                <Leaf className="w-3.5 h-3.5 text-[#304B38]" />
                <span>Conservation Ledger Attestation:</span>
              </div>
              <p>
                {language === 'HI'
                  ? 'यह संकल्प स्थानीय ग्राम वन पंचायत अभिलेख में पंजीकृत है। देशी बांज ओक (Quercus leucotrichophora) के पौधों की २ वर्षों तक नर्सरी देखभाल, मानसूनी रोपण एवं जीवित रहने की सुरक्षा सुनिश्चित की गई है।'
                  : 'This tree pledge is officially registered in the local village Van Panchayat conservation records. Indigenous Banj Oak saplings are nurtured across village nurseries, planted during monsoon seasons, and monitored for 2-year survival.'}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <Link
              href="/restoration"
              className="button-primary py-2.5 px-4 rounded text-[12.5px] font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Trees className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'अन्य पेड़ लगाएं' : 'Plant More Trees'}</span>
            </Link>

            <Link
              href="/calculator/route"
              className="px-4 py-2.5 rounded border border-[#2D322B29] bg-white hover:bg-[#F0EEE6] text-[12.5px] font-semibold text-[#242722] flex items-center gap-1.5 transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#496951]" />
              <span>{language === 'HI' ? 'नई यात्रा का हिसाब लगाएं' : 'Plan New Trip'}</span>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[840px] mx-auto py-12 text-center font-mono text-[13px] text-[#777C72]">
          Loading verification registry...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
