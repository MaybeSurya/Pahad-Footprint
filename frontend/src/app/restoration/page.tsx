'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, Trees, ShieldCheck, Leaf, CheckCircle2, Compass, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useTranslation } from '../../contexts/TranslationContext';

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
  const [name, setName] = useState('');
  const [saplings, setSaplings] = useState(9);
  const [initiative, setInitiative] = useState('Banj Oak Mid-Hill Reforestation');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPledged(true);
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
        <div className="section-kicker mb-2">
          <span>{t('restoration.kicker')}</span>
        </div>
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

      {/* Pledge Form */}
      <div className="journal-card p-6 space-y-4">
        <div>
          <h2 className="text-[17px] font-bold text-[#242722]">
            {t('restoration.pledgeHeading')}
          </h2>
          <p className="text-[12.5px] text-[#51554D] mt-1">
            {t('restoration.pledgeSub')}
          </p>
        </div>

        {pledged ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded border text-center space-y-1.5"
            style={{
              backgroundColor: 'var(--green-pale)',
              borderColor: 'rgba(73, 105, 81, 0.3)',
            }}
          >
            <div className="flex items-center justify-center gap-2 font-bold text-[15px] text-[#304B38]">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {language === 'HI'
                  ? `संकल्प दर्ज हुआ: ${saplings} बांज ओक के पौधे`
                  : `Pledge Intention Recorded: ${saplings} Banj Oak Saplings`}
              </span>
            </div>
            <p className="text-[12px] text-[#51554D]">
              {language === 'HI'
                ? `धन्यवाद, ${name || 'पहाड़ी यात्री'}! आपका संकल्प स्थानीय वन पंचायत रिकॉर्ड में सुरक्षित हो गया है।`
                : `Thank you, ${name || 'Mountain Traveler'}! Your pledge is logged to the local Van Panchayat ledger.`}
            </p>
          </motion.div>
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

            <button type="submit" className="button-primary w-full py-3">
              {language === 'HI' ? 'पौधारोपण संकल्प दर्ज करें' : 'Confirm Tree Planting Pledge'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
