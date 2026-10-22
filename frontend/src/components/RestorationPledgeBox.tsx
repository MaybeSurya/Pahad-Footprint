'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trees, ShieldCheck, CheckCircle2, Leaf, ArrowRight } from 'lucide-react';

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
  const [pledged, setPledged] = useState(false);

  const handlePledge = () => {
    setPledged(true);
    if (onPledgeSuccess) onPledgeSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="bg-[#EDF6F0] border border-[#D8E8DF] rounded-2xl p-5 shadow-card"
    >
      {/* Header with Oak Icon */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#1B4332] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
          <Trees className="w-5 h-5 text-[#C1ECD4]" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-[#111827]">
            Local Restoration Pledge: Himalayan Banj Oak
          </h3>
          <p className="text-[12px] text-[#4B5563] mt-0.5 leading-relaxed">
            Suggested illustrative contribution:{' '}
            <strong className="text-[#1B4332]">{saplings.perPerson} saplings per person</strong> ({saplings.total} saplings for this travel party).
          </p>
        </div>
      </div>

      {/* Keystone Species Card */}
      <div className="bg-[#1B4332] rounded-2xl p-4 flex items-center gap-3.5 mb-4 text-white shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
          <Leaf className="w-6 h-6 text-[#C1ECD4]" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white">Banj Oak (Quercus leucotrichophora)</p>
          <p className="text-[11.5px] text-white/80 leading-normal mt-0.5">
            Key ecosystem keystone: stabilizes fragile mountain topsoil and recharges Himalayan aquifers.
          </p>
        </div>
      </div>

      {/* Van Panchayat Disclaimer Banner */}
      <p className="text-[11px] text-[#4B5563] mb-4 bg-white/70 p-3 rounded-xl border border-[#D8E8DF] leading-relaxed">
        <strong>Community Notice:</strong> Pledges support Van Panchayat local nurseries and tree-planting drives. They represent voluntary illustrative contributions and are not certified carbon offsets.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5">
        <AnimatePresence mode="wait">
          {pledged ? (
            <motion.div
              key="pledged"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 bg-[#C1ECD4] border border-[#1B4332]/30 rounded-xl text-center text-[#1B4332] font-semibold text-[13px] flex items-center justify-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
              Pledge Recorded in Van Panchayat Ledger!
            </motion.div>
          ) : (
            <motion.button
              key="unpledged"
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={handlePledge}
              className="w-full py-3 px-4 bg-[#1B4332] hover:bg-[#143225] text-white text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
            >
              <ShieldCheck className="w-4 h-4 text-[#C1ECD4]" />
              Pledge {saplings.total} Oak Saplings
            </motion.button>
          )}
        </AnimatePresence>

        <Link
          href="/methodology"
          className="text-[11.5px] font-medium text-[#1B4332] hover:underline flex items-center justify-center gap-1 mt-1 group"
        >
          <span>Model v1.2-2026 | IPCC Methodology &amp; Estimation Protocols</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
};
