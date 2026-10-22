'use client';

import React, { useState } from 'react';

export default function RestorationPage() {
  const [pledged, setPledged] = useState(false);
  const [name, setName] = useState('');
  const [saplings, setSaplings] = useState(9);
  const [initiative, setInitiative] = useState('Banj Oak Mid-Hill Reforestation');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPledged(true);
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-2">
        <div className="w-12 h-12 rounded-card bg-[#1B4332] text-white flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L6 10h3.5v5H8v4h8v-4h-1.5v-5H18L12 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-[#111827]">Local Restoration Initiatives</h1>
          <p className="text-[13.5px] text-[#4B5563]">
            Community-governed Van Panchayat nurseries and oak reforestation corridors across Uttarakhand.
          </p>
        </div>
      </div>

      {/* Van Panchayat Initiatives Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-grid">
        <div className="pahad-card flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-[#1B4332] text-white flex items-center justify-center mb-3">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L6 10h3.5v5H8v4h8v-4h-1.5v-5H18L12 2z" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-[#111827] mb-1">Banj Oak Drive</h3>
            <p className="text-[12px] text-[#4B5563] leading-relaxed mb-4">
              Community nursery planting of Quercus leucotrichophora to restore mountain aquifer tables.
            </p>
          </div>
          <div>
            <div className="flex justify-between text-[11.5px] font-bold text-[#111827] mb-1">
              <span>6,420 Planted</span>
              <span className="text-[#1B4332]">65% of Target</span>
            </div>
            <div className="h-2 bg-[#EDF6F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#1B4332] rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
        </div>

        <div className="pahad-card flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center mb-3">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-[#111827] mb-1">Glacial Catchment Buffer</h3>
            <p className="text-[12px] text-[#4B5563] leading-relaxed mb-4">
              Revegetation of high-altitude moraines around Kedarnath &amp; Nanda Devi perimeter.
            </p>
          </div>
          <div>
            <div className="flex justify-between text-[11.5px] font-bold text-[#111827] mb-1">
              <span>142 ha Restored</span>
              <span className="text-[#2D6A4F]">47% of Target</span>
            </div>
            <div className="h-2 bg-[#EDF6F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#2D6A4F] rounded-full" style={{ width: '47%' }} />
            </div>
          </div>
        </div>

        <div className="pahad-card flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-[#C85A32] text-white flex items-center justify-center mb-3">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-[#111827] mb-1">Van Panchayat Councils</h3>
            <p className="text-[12px] text-[#4B5563] leading-relaxed mb-4">
              Direct seed nursery support and forest guard equipment for 23 village councils.
            </p>
          </div>
          <div>
            <div className="flex justify-between text-[11.5px] font-bold text-[#111827] mb-1">
              <span>23 Councils</span>
              <span className="text-[#C85A32]">85% Operational</span>
            </div>
            <div className="h-2 bg-[#EDF6F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#C85A32] rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Pledge Form */}
      <div className="pahad-card-mist">
        <h2 className="text-[18px] font-bold text-[#111827] mb-1">Make a Community Restoration Pledge</h2>
        <p className="text-[13px] text-[#4B5563] mb-4">
          Contributions directly sponsor sapling rearing in Van Panchayat village nurseries across Uttarakhand.
        </p>

        {pledged ? (
          <div className="p-4 bg-[#C1ECD4] border border-[#1B4332]/40 rounded-card text-center">
            <h3 className="text-[16px] font-bold text-[#002114]">Pledge Confirmed: {saplings} Banj Oak Saplings!</h3>
            <p className="text-[12.5px] text-[#1B4332] mt-1">
              Thank you, {name || 'Fellow Mountain Traveler'}! Your pledge is logged to the Van Panchayat registry.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#111827] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Bhatt"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#D8E8DF] rounded-input text-[13px] text-[#111827]"
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#111827] mb-1">Number of Saplings</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={saplings}
                  onChange={(e) => setSaplings(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-white border border-[#D8E8DF] rounded-input text-[13px] text-[#111827]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#111827] mb-1">Restoration Corridor</label>
              <select
                value={initiative}
                onChange={(e) => setInitiative(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#D8E8DF] rounded-input text-[13px] text-[#111827]"
              >
                <option>Banj Oak Mid-Hill Reforestation (Kumaon Division)</option>
                <option>Glacial Catchment Moraine Stabilization (Garhwal Division)</option>
                <option>Van Panchayat Village Nursery Support Fund</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1B4332] hover:bg-[#143225] text-white font-semibold text-[13.5px] rounded-btn shadow transition-colors"
            >
              Confirm Community Reforestation Pledge
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
