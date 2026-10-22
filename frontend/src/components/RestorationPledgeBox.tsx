'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
    <div className="bg-[#EDF6F0] border border-[#D8E8DF] rounded-card p-5 shadow-card">
      {/* Header with Oak Icon */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-btn bg-[#1B4332] flex items-center justify-center flex-shrink-0 text-white">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L6 10h3.5v5H8v4h8v-4h-1.5v-5H18L12 2z" />
          </svg>
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
      <div className="bg-[#1B4332] rounded-btn p-3.5 flex items-center gap-3.5 mb-4 text-white">
        <div className="w-12 h-12 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-8 h-8 fill-current text-[#C1ECD4]" viewBox="0 0 24 24">
            <path d="M12 2L5 12h4v7h6v-7h4L12 2z" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-bold text-white">Banj Oak (Quercus leucotrichophora)</p>
          <p className="text-[11.5px] text-white/80 leading-normal mt-0.5">
            Key ecosystem keystone: stabilizes fragile mountain topsoil and recharges Himalayan aquifers.
          </p>
        </div>
      </div>

      {/* Van Panchayat Disclaimer Banner */}
      <p className="text-[11px] text-[#4B5563] mb-4 bg-white/70 p-2.5 rounded-lg border border-[#D8E8DF] leading-relaxed">
        <strong>Community Notice:</strong> Pledges support Van Panchayat local nurseries and tree-planting drives. They represent voluntary illustrative contributions and are not certified carbon offsets.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5">
        {pledged ? (
          <div className="p-3 bg-[#C1ECD4] border border-[#1B4332]/30 rounded-btn text-center text-[#1B4332] font-semibold text-[13px] flex items-center justify-center gap-2">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Pledge Recorded in Van Panchayat Ledger!
          </div>
        ) : (
          <button
            onClick={handlePledge}
            className="w-full py-2.5 px-4 bg-[#1B4332] hover:bg-[#143225] text-white text-[13px] font-semibold rounded-btn transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Pledge {saplings.total} Oak Saplings
          </button>
        )}

        <Link
          href="/methodology"
          className="text-[11.5px] font-medium text-[#1B4332] hover:underline flex items-center justify-center gap-1 mt-1"
        >
          Model v1.2-2026 | IPCC Methodology &amp; Estimation Protocols →
        </Link>
      </div>
    </div>
  );
};
