'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  ArrowLeft,
  Trees,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  Compass,
  ArrowRight,
  ExternalLink,
  CreditCard,
  HeartHandshake,
  Sprout,
  Award,
  MapPin,
  Info,
  BookOpen,
} from 'lucide-react';
import gsap from 'gsap';
import { useTranslation } from '../../contexts/TranslationContext';
import { RecognitionCertificate } from '../../components/RecognitionCertificate';
import { logActivity } from '../../lib/activityLogs';
import { DISTRICTS_META, VAN_PANCHAYAT_RESEARCH } from '../../lib/uttarakhandData';

// ─── Animated progress bar ───────────────────────────────────────────────────
function ProgressBar({ target, isInView }: { target: number; isInView: boolean }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!isInView || triggered.current || !fillRef.current) return;
    triggered.current = true;
    gsap.to(fillRef.current, {
      scaleX: target / 100,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.2,
    });
  }, [isInView, target]);

  return (
    <div className="progress-track h-2 bg-[#F0EEE6] rounded-full overflow-hidden border border-[#2D322B29]">
      <div
        ref={fillRef}
        className="h-full bg-[#496951] rounded-full"
        style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
      />
    </div>
  );
}

// ─── Initiative card ─────────────────────────────────────────────────────────
interface InitiativeCardProps {
  icon: React.ReactNode;
  title: string;
  speciesLatin?: string;
  description: string;
  stat: string;
  progress: number;
  progressLabel: string;
  delay?: number;
}

function InitiativeCard({
  icon,
  title,
  speciesLatin,
  description,
  stat,
  progress,
  progressLabel,
  delay = 0,
}: InitiativeCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className="journal-card flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div
            className="w-9 h-9 rounded border flex items-center justify-center text-[#304B38]"
            style={{
              backgroundColor: 'var(--green-pale)',
              borderColor: 'rgba(73, 105, 81, 0.25)',
            }}
          >
            {icon}
          </div>
          <span className="font-mono text-[11px] font-bold text-[#304B38] px-2 py-0.5 rounded bg-[#E8EDE5]">
            {progress}% OF TARGET
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="font-bold text-[15px] text-[#242722]">{title}</h3>
            {speciesLatin && (
              <span className="text-[11px] italic text-[#777C72]">
                {speciesLatin}
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#51554D] leading-relaxed mt-1">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t" style={{ borderColor: 'var(--line)' }}>
        <div className="flex justify-between items-center text-[11px] font-mono mb-1.5">
          <span className="font-bold text-[#242722]">{stat}</span>
          <span className="text-[#777C72]">{progressLabel}</span>
        </div>
        <ProgressBar target={progress} isInView={isInView} />
      </div>
    </motion.div>
  );
}

export default function RestorationPage() {
  const { t, language } = useTranslation();
  const [pledged, setPledged] = useState(false);
  const [donated, setDonated] = useState(false);
  const [actionType, setActionType] = useState<'donate' | 'plant'>('donate');
  const [name, setName] = useState('');
  const [saplings, setSaplings] = useState(9);
  const [initiative, setInitiative] = useState('Banj Oak Mid-Hill Reforestation');
  const [certificateId, setCertificateId] = useState<string>('');

  const COST_PER_TREE = 120;
  const donationAmount = saplings * COST_PER_TREE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const certId = certificateId || `UK-VP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setCertificateId(certId);
    setPledged(true);
    const traveler = name.trim() || (language === 'HI' ? 'पहाड़ी यात्री' : 'Himalayan Traveler');
    logActivity({
      type: 'pledge',
      title: 'Native Banj Oak Sapling Pledge',
      travelerName: traveler,
      trees: saplings,
      certificateId: certId,
      division: initiative,
      status: 'pledged',
    });
  };

  return (
    <div className="max-w-[980px] 2xl:max-w-[1180px] 3xl:max-w-[1320px] mx-auto space-y-8 py-4">
      {/* Back Link */}
      <div>
        <Link
          href="/"
          className="text-link font-mono text-[11.5px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('restoration.backLink')}</span>
        </Link>
      </div>

      {/* Header */}
      <div className="pb-4 border-b" style={{ borderColor: 'var(--line)' }}>
        <h1
          className="text-[30px] sm:text-[40px] font-semibold tracking-[-0.035em] leading-tight mb-3"
          style={{ color: 'var(--ink)' }}
        >
          {t('restoration.pageHeader')}
        </h1>
        <p
          className="text-[15px] sm:text-[16px] leading-relaxed max-w-2xl"
          style={{ color: 'var(--ink-soft)' }}
        >
          {t('restoration.pageSubtitle')}
        </p>
      </div>

      {/* 3 Restoration Initiatives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <InitiativeCard
          icon={<Trees className="w-4 h-4" />}
          title={t('restoration.banjOakTitle')}
          speciesLatin="Quercus leucotrichophora"
          description={t('restoration.banjOakDesc')}
          stat={language === 'HI' ? '6,420 पौधे लगाए' : '6,420 Planted'}
          progress={65}
          progressLabel={language === 'HI' ? '65% लक्ष्य पूरा' : '65% of Seasonal Goal'}
          delay={0.05}
        />

        <InitiativeCard
          icon={<Compass className="w-4 h-4" />}
          title={t('restoration.rhododendronTitle')}
          speciesLatin="Rhododendron arboreum"
          description={t('restoration.rhododendronDesc')}
          stat={language === 'HI' ? '142 हेक्टेयर' : '142 Hectares'}
          progress={47}
          progressLabel={language === 'HI' ? '47% संरक्षित' : '47% Protected'}
          delay={0.12}
        />

        <InitiativeCard
          icon={<ShieldCheck className="w-4 h-4" />}
          title={t('restoration.deodarTitle')}
          speciesLatin="Cedrus deodara"
          description={t('restoration.deodarDesc')}
          stat={language === 'HI' ? '23 वन पंचायतें' : '23 Councils'}
          progress={85}
          progressLabel={language === 'HI' ? '85% सक्रिय' : '85% Operational'}
          delay={0.2}
        />
      </div>

      {/* Verified Van Panchayat Network & Forest Carbon Science */}
      <div className="journal-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#304B38] text-white flex items-center justify-center font-bold">
              <Trees className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[15px] sm:text-[16px] font-bold text-[#242722]">
                {language === 'HI'
                  ? 'उत्तराखंड वन पंचायत नेटवर्क एवं वैज्ञानिक प्रमाण'
                  : 'Statewide Van Panchayat Network & Forest Carbon Science'}
              </h2>
              <span className="text-[11.5px] text-[#51554D]">
                {language === 'HI'
                  ? 'कुमाऊं विश्वविद्यालय शोध (2024) एवं वन विभाग वार्षिक रिपोर्ट 2023–24 पर आधारित'
                  : 'Grounded in Kumaun University (2024) research & Forest Dept. Annual Report 2023–24'}
              </span>
            </div>
          </div>

          <Link
            href="/methodology"
            className="text-[11.5px] font-mono text-[#304B38] font-bold hover:underline flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'पूर्ण शोध डेटा देखें →' : 'View Full Scientific Data →'}</span>
          </Link>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3 rounded border border-[#2D322B1F] bg-[#FAF9F5]">
            <span className="text-[10px] text-[#777C72] uppercase block">Official Councils</span>
            <span className="text-[18px] sm:text-[20px] font-bold text-[#304B38] block mt-0.5">
              12,089+
            </span>
            <span className="text-[10px] text-[#51554D] font-sans block">Across all 13 Districts</span>
          </div>

          <div className="p-3 rounded border border-[#2D322B1F] bg-[#FAF9F5]">
            <span className="text-[10px] text-[#777C72] uppercase block">Mean Carbon Stock</span>
            <span className="text-[18px] sm:text-[20px] font-bold text-[#242722] block mt-0.5">
              82.37
            </span>
            <span className="text-[10px] text-[#51554D] font-sans block">t C/ha (Kumaun Univ 2024)</span>
          </div>

          <div className="p-3 rounded border border-[#2D322B1F] bg-[#FAF9F5]">
            <span className="text-[10px] text-[#777C72] uppercase block">Broadleaf ABCF</span>
            <span className="text-[18px] sm:text-[20px] font-bold text-[#304B38] block mt-0.5">
              175.77
            </span>
            <span className="text-[10px] text-[#51554D] font-sans block">Mg C/ha (760 trees/ha)</span>
          </div>

          <div className="p-3 rounded border border-[#2D322B1F] bg-[#FAF9F5]">
            <span className="text-[10px] text-[#777C72] uppercase block">SPARC Initiatives</span>
            <span className="text-[18px] sm:text-[20px] font-bold text-[#8A5D2E] block mt-0.5">
              750
            </span>
            <span className="text-[10px] text-[#51554D] font-sans block">Active Van Panchayats</span>
          </div>
        </div>

        {/* Explanatory Note with DOI badge */}
        <div className="p-3.5 rounded bg-[#FAF9F5] border border-[#496951]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-[#51554D]">
          <div>
            <span className="font-bold text-[#242722]">
              {language === 'HI'
                ? 'बांज ओक ही क्यों? — '
                : 'Why Native Banj Oak? — '}
            </span>
            <span>
              {language === 'HI'
                ? 'वैज्ञानिक अध्ययनों से सिद्ध है कि मध्य-ऊंचाई पर बांज ओक के जंगल चीड़ की तुलना में सर्वाधिक कार्बन अवशोषित करते हैं और जलधाराओं को वर्षभर जीवित रखते हैं।'
                : 'Peer-reviewed studies confirm mid-altitude Banj Oak forests hold the highest carbon density in the Himalayas while stabilizing slopes and recharging underground springs.'}
            </span>
          </div>

          <a
            href={VAN_PANCHAYAT_RESEARCH.kumaunStudy2024.doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-mono text-[#304B38] font-bold bg-white px-2.5 py-1 rounded border border-[#496951]/30 hover:underline"
          >
            <span>DOI: {VAN_PANCHAYAT_RESEARCH.kumaunStudy2024.doi}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Pledge & Donation Form */}
      <div className="journal-card p-6 space-y-5">
        <div>
          <h2 className="text-[17px] font-bold text-[#242722]">
            {t('restoration.pledgeHeading')}
          </h2>
          <p className="text-[12.5px] text-[#51554D] mt-1">
            {language === 'HI'
              ? 'यात्री या तो सीधे पौधे लगा सकते हैं अथवा किसी प्रमाणित वन संरक्षण एनजीओ को समतुल्य राशि दान कर सकते हैं।'
              : 'Travelers can choose either to plant saplings directly or donate the equivalent amount for trees to a certified conservation NGO.'}
          </p>
        </div>

        {/* Choice Switcher: Donate vs Plant */}
        <div className="flex rounded bg-[#F0EEE6] p-1 border border-[#2D322B29] gap-1">
          <button
            type="button"
            onClick={() => setActionType('donate')}
            className={`flex-1 py-2 px-3 rounded text-[12px] sm:text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
              actionType === 'donate'
                ? 'bg-white text-[#304B38] shadow-xs border border-[#496951]/30 font-bold'
                : 'text-[#51554D] hover:text-[#242722]'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-[#304B38]" />
            <span>{language === 'HI' ? 'एनजीओ को समतुल्य राशि दान करें (अनुशंसित)' : 'Donate Equivalent Amount to NGO (Recommended)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActionType('plant')}
            className={`flex-1 py-2 px-3 rounded text-[12px] sm:text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
              actionType === 'plant'
                ? 'bg-white text-[#304B38] shadow-xs border border-[#496951]/30 font-bold'
                : 'text-[#51554D] hover:text-[#242722]'
            }`}
          >
            <Sprout className="w-4 h-4 text-[#496951]" />
            <span>{language === 'HI' ? 'स्वयं पौधे लगाएं' : 'Plant Saplings Myself'}</span>
          </button>
        </div>

        {/* Mode A: Donate Equivalent to NGO */}
        {actionType === 'donate' && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded border border-[#2D322B1F] bg-[#FAF9F5] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                    {language === 'HI' ? 'प्रमाण पत्र हेतु आपका नाम' : 'Your Name for Recognition Certificate'}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'HI' ? 'उदा. अमित जोशी / पहाड़ी यात्री' : 'e.g. Maya Bhatt / Himalayan Traveler'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#2D322B29] rounded text-[13px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
                  />
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                      {language === 'HI' ? 'पेड़ों की संख्या' : 'Number of Trees'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={saplings}
                      onChange={(e) => setSaplings(Math.max(1, Number(e.target.value) || 1))}
                      className="w-28 h-10 px-3 bg-white border border-[#2D322B29] rounded text-[13px] font-mono font-bold text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-[#777C72] uppercase block">
                      {language === 'HI' ? 'कुल दान (₹120/पेड़)' : 'Total Cost'}
                    </span>
                    <div className="font-mono text-[22px] font-bold text-[#304B38]">
                      ₹{donationAmount}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-[#51554D] leading-relaxed pt-2 border-t border-[#2D322B14]">
                {language === 'HI'
                  ? 'यदि आप स्वयं पौधे नहीं लगाना चाहते, तो हिमालयी वन पंचायतों व गैर-सरकारी संगठनों (NGO) को समतुल्य राशि दान करें। वे आपके नाम से पौधे रोपकर उनकी दो वर्षों तक सुरक्षा करेंगे।'
                  : 'If you prefer not to plant trees yourself, you can donate the equivalent amount to certified Himalayan community NGOs & Van Panchayats who will plant, care for, and nurture the saplings on your behalf.'}
              </p>
            </div>

            <a
              href="https://devnexis.in/payment"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                const certId = certificateId || `UK-VP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
                setCertificateId(certId);
                setDonated(true);
                const traveler = name.trim() || (language === 'HI' ? 'पहाड़ी यात्री' : 'Himalayan Traveler');
                logActivity({
                  type: 'donation',
                  title: 'NGO Tree Support Donation',
                  travelerName: traveler,
                  trees: saplings,
                  amount: donationAmount,
                  certificateId: certId,
                  partner: 'DevNexis / Uttarakhand Van Panchayat JFM',
                  division: initiative,
                  status: 'confirmed',
                });
              }}
              className="button-primary w-full py-3.5 text-center flex items-center justify-center gap-2 font-bold text-[13.5px] rounded shadow-xs"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {language === 'HI'
                  ? `₹${donationAmount} दान करें (${saplings} पेड़) →`
                  : `Donate ₹${donationAmount} for ${saplings} Trees to NGO →`}
              </span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {donated && (
              <div className="pt-2">
                <RecognitionCertificate
                  travelerName={name.trim() || (language === 'HI' ? 'पहाड़ी यात्री' : 'Himalayan Traveler')}
                  treeCount={saplings}
                  species="Himalayan Banj Oak (Quercus leucotrichophora)"
                  isDonation={true}
                  donationAmount={donationAmount}
                  certificateId={certificateId}
                />
              </div>
            )}
          </div>
        )}

        {/* Mode B: Plant Saplings Myself */}
        {actionType === 'plant' && (
          <div className="pt-2">
            {pledged ? (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded border text-center space-y-1"
                  style={{
                    backgroundColor: 'var(--green-pale)',
                    borderColor: 'rgba(73, 105, 81, 0.3)',
                  }}
                >
                  <div className="flex items-center justify-center gap-2 font-bold text-[14.5px] text-[#304B38]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {language === 'HI'
                        ? `संकल्प दर्ज हुआ: ${saplings} बांज ओक के पौधे`
                        : `Pledge Intention Recorded: ${saplings} Banj Oak Saplings`}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#51554D]">
                    {language === 'HI'
                      ? `धन्यवाद, ${name || 'पहाड़ी यात्री'}! आपका सम्मान प्रमाण पत्र नीचे प्रस्तुत है:`
                      : `Thank you, ${name || 'Mountain Traveler'}! Your official recognition certificate is ready below:`}
                  </p>
                </motion.div>

                <RecognitionCertificate
                  travelerName={name.trim() || (language === 'HI' ? 'पहाड़ी यात्री' : 'Himalayan Traveler')}
                  treeCount={saplings}
                  species="Himalayan Banj Oak (Quercus leucotrichophora)"
                  isDonation={false}
                  certificateId={certificateId}
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                      {language === 'HI' ? 'यात्री का नाम' : 'Traveler Name'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'HI' ? 'उदा. माया भट्ट' : 'e.g. Maya Bhatt'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#2D322B29] rounded text-[13px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                      {language === 'HI' ? 'पौधों की संख्या' : 'Number of Oak Saplings'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={saplings}
                      onChange={(e) => setSaplings(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-white border border-[#2D322B29] rounded text-[13px] font-mono text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#242722] mb-1">
                    {language === 'HI' ? 'पौधारोपण क्षेत्र' : 'Restoration Area'}
                  </label>
                  <select
                    value={initiative}
                    onChange={(e) => setInitiative(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#2D322B29] rounded text-[13px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
                  >
                    <option>
                      {language === 'HI' ? 'बांज ओक पौधारोपण (कुमाऊं मंडल)' : 'Banj Oak Mid-Hill Reforestation (Kumaon Division)'}
                    </option>
                    <option>
                      {language === 'HI' ? 'पहाड़ी जलधारा संरक्षण (गढ़वाल मंडल)' : 'Glacial Catchment Spring Protection (Garhwal Division)'}
                    </option>
                    <option>
                      {language === 'HI' ? 'ग्राम वन पंचायत सामुदायिक नर्सरी फंड' : 'Van Panchayat Village Nursery Support Fund'}
                    </option>
                  </select>
                </div>

                <button type="submit" className="button-primary w-full py-3 font-bold text-[13.5px]">
                  {language === 'HI' ? 'पौधारोपण संकल्प दर्ज करें एवं प्रमाण पत्र पाएं' : 'Confirm Personal Tree Pledge & Get Certificate'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
