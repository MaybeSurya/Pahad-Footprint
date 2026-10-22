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
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
    >
      {/* Header with Oak Icon */}
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-700 shadow-xs">
          <Trees className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-slate-900">
            Local Restoration Pledge: Himalayan Banj Oak
          </h3>
          <p className="text-[12.5px] text-slate-600 mt-0.5 leading-relaxed">
            Suggested illustrative contribution:{' '}
            <strong className="text-emerald-700 font-semibold">{saplings.perPerson} saplings per person</strong> ({saplings.total} saplings for this travel party).
          </p>
        </div>
      </div>

      {/* Keystone Species Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 text-white shadow-xs">
        <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
          <Leaf className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white">Banj Oak (Quercus leucotrichophora)</p>
          <p className="text-[11.5px] text-slate-300 leading-normal mt-0.5">
            Key ecosystem keystone: stabilizes fragile mountain topsoil and recharges Himalayan aquifers.
          </p>
        </div>
      </div>

      {/* Van Panchayat Disclaimer Banner */}
      <p className="text-[11.5px] text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
        <strong className="text-slate-800">Community Notice:</strong> Pledges support Van Panchayat local nurseries and tree-planting drives. They represent voluntary illustrative contributions and are not certified carbon offsets.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-1">
        <AnimatePresence mode="wait">
          {pledged ? (
            <motion.div
              key="pledged"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-semibold text-[13px] flex items-center justify-center gap-2 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Pledge Recorded in Van Panchayat Ledger!
            </motion.div>
          ) : (
            <motion.button
              key="unpledged"
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={handlePledge}
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-[13.5px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              Pledge {saplings.total} Oak Saplings
            </motion.button>
          )}
        </AnimatePresence>

        <Link
          href="/methodology"
          className="text-[12px] font-medium text-emerald-700 hover:text-emerald-800 hover:underline flex items-center justify-center gap-1 mt-1 group"
        >
          <span>Model v1.2-2026 | IPCC Methodology &amp; Estimation Protocols</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
};
