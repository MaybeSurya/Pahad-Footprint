import React from 'react';

export default function MethodologyPage() {
  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-2">
        <div className="w-12 h-12 rounded-card bg-[#1B4332] text-white flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-[#111827]">Methodology &amp; Scientific Sources</h1>
          <p className="text-[13.5px] text-[#4B5563]">
            Mathematical models, IPCC emission factors, altitude grade multipliers, and governance versioning.
          </p>
        </div>
      </div>

      {/* Illustrative Notice */}
      <div className="p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-card text-[12.5px] text-[#78350F] leading-relaxed flex items-start gap-3">
        <svg className="w-5 h-5 text-[#92400E] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <strong className="text-[#92400E]">Scientific Transparency Notice:</strong> Emission constants and altitude multipliers are illustrative approximations derived from ARAI standards, IPCC Chapter 8 guidelines, and local Himalayan fuel consumption observation surveys. They are intended for educational tourism impact analysis.
        </div>
      </div>

      {/* Section 1: Transport Math */}
      <div className="pahad-card space-y-4">
        <h2 className="text-[17px] font-bold text-[#1B4332]">1. Transport Emission Formulation</h2>
        <div className="bg-[#EDF6F0] p-4 rounded-card font-mono text-[13px] text-[#1B4332] space-y-2 border border-[#D8E8DF]">
          <div>
            <strong>Vehicle-based modes (SUV, Sedan, EV):</strong>
          </div>
          <div className="bg-white p-2.5 rounded border border-[#D8E8DF]">
            kg CO₂e/person = (distance_km × emission_factor_g × terrain_multiplier) ÷ (passengers × 1000)
          </div>

          <div className="pt-2">
            <strong>Shared public transit (UTC Bus):</strong>
          </div>
          <div className="bg-white p-2.5 rounded border border-[#D8E8DF]">
            kg CO₂e/person = (distance_km × transit_factor_g × terrain_multiplier) ÷ 1000
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { name: 'Diesel SUV', factor: '180 g CO₂e/vkm', source: 'ARAI Real-world' },
            { name: 'Petrol Sedan', factor: '140 g CO₂e/vkm', source: 'ARAI Standard' },
            { name: 'Electric Vehicle', factor: '45 g CO₂e/vkm', source: 'Northern Grid CEA' },
            { name: 'Shared UTC Bus', factor: '30 g CO₂e/pkm', source: 'Uttarakhand Transport' },
          ].map((f) => (
            <div key={f.name} className="p-3 bg-[#F8FAF9] border border-[#D8E8DF] rounded-card">
              <div className="text-[13px] font-bold text-[#111827]">{f.name}</div>
              <div className="text-[12px] font-bold text-[#1B4332] mt-0.5">{f.factor}</div>
              <div className="text-[10.5px] text-[#4B5563] mt-1">{f.source}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Terrain Multipliers */}
      <div className="pahad-card space-y-3">
        <h2 className="text-[17px] font-bold text-[#1B4332]">2. Altitude Elevation Multipliers</h2>
        <p className="text-[13px] text-[#4B5563] leading-relaxed">
          Mountain switchbacks and continuous upward gradient force engines into higher RPM low-gear operation, compounding fuel consumption and tailpipe carbon output compared to plains driving.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-[#EDF6F0] border border-[#D8E8DF] rounded-card">
            <span className="text-[11.5px] font-bold uppercase text-[#4B5563]">Foothills Zone</span>
            <div className="text-[20px] font-extrabold text-[#1B4332] my-1">1.00×</div>
            <p className="text-[11.5px] text-[#4B5563]">&lt;800m AMSL (Ramnagar, Haridwar plain corridors)</p>
          </div>
          <div className="p-3.5 bg-[#EDF6F0] border border-[#D8E8DF] rounded-card">
            <span className="text-[11.5px] font-bold uppercase text-[#4B5563]">Mid-Hills Zone</span>
            <div className="text-[20px] font-extrabold text-[#1B4332] my-1">1.25×</div>
            <p className="text-[11.5px] text-[#4B5563]">800m – 2,400m AMSL (Nainital, Almora, Mussoorie)</p>
          </div>
          <div className="p-3.5 bg-[#EDF6F0] border border-[#D8E8DF] rounded-card">
            <span className="text-[11.5px] font-bold uppercase text-[#4B5563]">High Altitude Alpine</span>
            <div className="text-[20px] font-extrabold text-[#1B4332] my-1">1.40×</div>
            <p className="text-[11.5px] text-[#4B5563]">&gt;2,400m AMSL (Chopta, Joshimath, Auli, Kedarnath)</p>
          </div>
        </div>
      </div>

      {/* Section 3: Lodging Intensities */}
      <div className="pahad-card space-y-3">
        <h2 className="text-[17px] font-bold text-[#1B4332]">3. Accommodation Intensity Factors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { type: 'Luxury Resort', kg: '24.0 kg/night', note: 'Central HVAC, pools, diesel generators' },
            { type: 'Standard Hotel', kg: '9.0 kg/night', note: 'Conventional water heating & electricity' },
            { type: 'Pahadi Homestay', kg: '6.0 kg/night', note: 'Solar geysers, low food-mile cuisine' },
            { type: 'Eco-Camp', kg: '3.5 kg/night', note: 'Minimal electricity, solar lanterns' },
          ].map((item) => (
            <div key={item.type} className="p-3 bg-[#F8FAF9] border border-[#D8E8DF] rounded-card">
              <div className="text-[13px] font-bold text-[#111827]">{item.type}</div>
              <div className="text-[14px] font-bold text-[#1B4332] my-0.5">{item.kg}</div>
              <div className="text-[11px] text-[#4B5563] leading-normal">{item.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
