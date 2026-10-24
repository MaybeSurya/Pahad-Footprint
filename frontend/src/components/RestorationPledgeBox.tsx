'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trees,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  ExternalLink,
  CreditCard,
  HeartHandshake,
  Sprout,
  Award,
} from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { RecognitionCertificate } from './RecognitionCertificate';
import { logActivity } from '../lib/activityLogs';

interface RestorationPledgeBoxProps {
  saplings: {
    perPerson: number;
    total: number;
  };
  onPledgeSuccess?: () => void;
}

export const RestorationPledgeBox: React.FC<RestorationPledgeBoxProps> = ({
  saplings,
  onPledgeSuccess,
}) => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'donate' | 'plant'>('donate');
  const [pledged, setPledged] = useState(false);
  const [donated, setDonated] = useState(false);
  const [travelerName, setTravelerName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateId, setCertificateId] = useState<string>('');

  // Standard nursery raising & 2-year maintenance cost per high-altitude sapling
  const COST_PER_SAPLING = 120;
  const totalDonationAmount = saplings.total * COST_PER_SAPLING;

  const handlePledge = () => {
    const certId = certificateId || `UK-VP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setCertificateId(certId);
    setPledged(true);
    setShowCertificate(true);
    const name = travelerName.trim() || (language === 'HI' ? 'पहाड़ी यात्री' : 'Himalayan Traveler');
    logActivity({
      type: 'pledge',
      title: 'Native Banj Oak Sapling Pledge',
      travelerName: name,
      trees: saplings.total,
      certificateId: certId,
      division: 'Uttarakhand Van Panchayat Community Lands',
      status: 'pledged',
    });
    if (onPledgeSuccess) onPledgeSuccess();
  };

  const handleConfirmDonation = () => {
    const certId = certificateId || `UK-VP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setCertificateId(certId);
    setDonated(true);
    setShowCertificate(true);
    const name = travelerName.trim() || (language === 'HI' ? 'पहाड़ी यात्री' : 'Himalayan Traveler');
    logActivity({
      type: 'donation',
      title: 'NGO Tree Support Donation',
      travelerName: name,
      trees: saplings.total,
      amount: totalDonationAmount,
      certificateId: certId,
      partner: 'DevNexis / Uttarakhand Van Panchayat JFM',
      division: 'Uttarakhand Van Panchayat Community Lands',
      status: 'confirmed',
    });
    if (onPledgeSuccess) onPledgeSuccess();
  };

  const suggestedText = t('pledge.suggested')
    .replace('{perPerson}', saplings.perPerson.toString())
    .replace('{total}', saplings.total.toString());

  const buttonText = t('pledge.pledgeButton').replace(
    '{total}',
    saplings.total.toString()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12 }}
      className="journal-card space-y-4"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded border flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: 'var(--green-pale)',
            borderColor: 'rgba(73, 105, 81, 0.25)',
            color: 'var(--green-deep)',
          }}
        >
          <Trees className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-[15px] font-bold text-[#242722] tracking-tight">
            {t('pledge.title')}
          </h4>
          <p className="text-[12px] text-[#51554D] mt-1 leading-relaxed">
            {suggestedText}
          </p>
        </div>
      </div>

      {/* Indigenous Species Card */}
      <div
        className="rounded p-3.5 flex items-center gap-3 border"
        style={{
          backgroundColor: 'var(--ink)',
          borderColor: 'var(--ink)',
          color: '#FFFFFF',
        }}
      >
        <div
          className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(232, 237, 229, 0.15)' }}
        >
          <Leaf className="w-4 h-4 text-[#E8EDE5]" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[13px] font-bold text-white">
              {t('pledge.speciesTitle')}
            </span>
            <span className="text-[11px] italic text-[#CFCABF]">
              {t('pledge.speciesLatin')}
            </span>
          </div>
          <p className="text-[11px] text-[#CFCABF] mt-0.5 leading-snug">
            {t('pledge.speciesDesc')}
          </p>
        </div>
      </div>

      {/* Traveler Name Input for Certificate */}
      <div className="pt-1">
        <label className="block text-[11.5px] font-semibold text-[#242722] mb-1">
          {language === 'HI' ? 'प्रमाण पत्र हेतु आपका नाम' : 'Your Name for Recognition Certificate'}
        </label>
        <input
          type="text"
          placeholder={language === 'HI' ? 'उदा. अमित जोशी / पहाड़ी यात्री' : 'e.g. Maya Bhatt / Himalayan Traveler'}
          value={travelerName}
          onChange={(e) => setTravelerName(e.target.value)}
          className="w-full h-9 px-3 bg-white border border-[#2D322B29] rounded text-[12.5px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
        />
      </div>

      {/* Tab Switcher: Donate Equivalent vs Plant Myself */}
      <div className="flex rounded bg-[#F0EEE6] p-1 border border-[#2D322B29] gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('donate')}
          className={`flex-1 py-1.5 px-2 rounded text-[11.5px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'donate'
              ? 'bg-white text-[#304B38] shadow-xs border border-[#496951]/30 font-bold'
              : 'text-[#51554D] hover:text-[#242722]'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 text-[#304B38]" />
          <span>{t('pledge.donateOption')}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('plant')}
          className={`flex-1 py-1.5 px-2 rounded text-[11.5px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'plant'
              ? 'bg-white text-[#304B38] shadow-xs border border-[#496951]/30 font-bold'
              : 'text-[#51554D] hover:text-[#242722]'
          }`}
        >
          <Sprout className="w-3.5 h-3.5 text-[#496951]" />
          <span>{t('pledge.plantOption')}</span>
        </button>
      </div>

      {/* Option 1: Donate Equivalent Amount to NGO */}
      {activeTab === 'donate' && (
        <div className="space-y-3.5">
          <div
            className="rounded p-3 text-[11.5px] leading-relaxed border space-y-1.5"
            style={{
              backgroundColor: 'var(--paper-deep)',
              borderColor: 'var(--line)',
              color: 'var(--ink-soft)',
            }}
          >
            <p className="text-[#242722] leading-relaxed">
              {t('pledge.donateNotice')}
            </p>
            <div className="flex items-center justify-between font-mono text-[11px] pt-1 border-t border-[#2D322B14]">
              <span className="text-[#777C72]">{t('pledge.donatePerTree')}</span>
              <span className="font-bold text-[#304B38]">₹{COST_PER_SAPLING} / tree</span>
            </div>
          </div>

          {/* Amount Calculation Banner */}
          <div className="p-3 rounded border border-[#496951]/25 bg-[#E8EDE5]/50 flex items-center justify-between">
            <div>
              <span className="text-[10.5px] font-mono text-[#777C72] uppercase block">
                {language === 'HI' ? 'समतुल्य दान राशि' : 'Equivalent Tree Support Cost'}
              </span>
              <span className="text-[12px] font-medium text-[#242722]">
                {saplings.total} trees × ₹{COST_PER_SAPLING}
              </span>
            </div>
            <div className="font-mono text-[20px] font-bold text-[#304B38]">
              ₹{totalDonationAmount}
            </div>
          </div>

          {/* Direct Payment Link Button */}
          <div className="space-y-2">
            <a
              href="https://devnexis.in/payment"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleConfirmDonation}
              className="button-primary w-full py-3.5 px-4 text-center rounded text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {language === 'HI'
                  ? `₹${totalDonationAmount} दान करें (${saplings.total} पेड़) →`
                  : `Donate ₹${totalDonationAmount} for ${saplings.total} Trees →`}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {donated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-2.5 rounded text-center text-[11.5px] text-[#304B38] font-bold bg-[#E8EDE5] border border-[#496951]/30 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('pledge.donateSuccess')}</span>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Option 2: Plant Saplings Myself */}
      {activeTab === 'plant' && (
        <div className="space-y-3.5">
          {/* Community Caveat Notice */}
          <div
            className="rounded p-3 text-[11px] leading-relaxed border"
            style={{
              backgroundColor: 'var(--paper-deep)',
              borderColor: 'var(--line)',
              color: 'var(--ink-soft)',
            }}
          >
            <strong className="text-[#242722]">{t('pledge.fieldNoteTitle')}</strong>{' '}
            {t('pledge.fieldNoteBody')}
          </div>

          {/* Action Button & Confirmation */}
          <div className="pt-1 space-y-2">
            <AnimatePresence mode="wait">
              {pledged ? (
                <motion.div
                  key="pledged"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded text-center font-semibold flex items-center justify-center gap-2 border text-[12.5px]"
                  style={{
                    backgroundColor: 'var(--green-pale)',
                    borderColor: 'rgba(73, 105, 81, 0.3)',
                    color: 'var(--green-deep)',
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('pledge.pledgeThankYou')}</span>
                </motion.div>
              ) : (
                <motion.button
                  key="unpledged"
                  type="button"
                  whileTap={{ scale: 0.99 }}
                  onClick={handlePledge}
                  className="btn-accent w-full justify-center py-3 text-[13px]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{buttonText}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Recognition Certificate Display */}
      {showCertificate && (
        <div className="pt-3 border-t border-[#496951]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11.5px] font-bold text-[#304B38] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#B3834D]" />
              <span>{language === 'HI' ? 'आपका सम्मान प्रमाण पत्र' : 'Your Recognition Certificate'}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowCertificate(false)}
              className="text-[11px] text-[#777C72] hover:text-[#242722] underline"
            >
              {language === 'HI' ? 'छुपाएं' : 'Hide'}
            </button>
          </div>
          <RecognitionCertificate
            travelerName={travelerName.trim() || (language === 'HI' ? 'पहाड़ी यात्री' : 'Himalayan Traveler')}
            treeCount={saplings.total}
            isDonation={activeTab === 'donate'}
            donationAmount={totalDonationAmount}
            certificateId={certificateId}
            onClose={() => setShowCertificate(false)}
          />
        </div>
      )}

      {/* Button to reopen certificate if closed */}
      {!showCertificate && (pledged || donated) && (
        <button
          type="button"
          onClick={() => setShowCertificate(true)}
          className="w-full py-2.5 px-3 rounded text-[12px] font-semibold bg-[#E8EDE5] text-[#304B38] border border-[#496951]/30 hover:bg-[#E8EDE5]/80 transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Award className="w-4 h-4 text-[#B3834D]" />
          <span>{language === 'HI' ? 'अपना सम्मान प्रमाण पत्र देखें (QR कोड सहित)' : 'View Recognition Certificate (with QR Code)'}</span>
        </button>
      )}

      <div className="text-center pt-1">
        <Link
          href="/methodology"
          className="text-link text-[11.5px]"
        >
          {t('pledge.methodologyLink')}
        </Link>
      </div>
    </motion.div>
  );
};
