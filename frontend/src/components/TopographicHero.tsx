'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MountainSnow, Leaf, Trees, ShieldCheck, Compass, ArrowDownRight, Sparkles } from 'lucide-react';

export function TopographicHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B4332] via-[#143225] to-[#0A1D15] text-white p-6 sm:p-10 shadow-elevated border border-[#2D6A4F]/40"
    >
      {/* Ambient Mountain Backdrop Contours */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15 mix-blend-screen bg-repeat"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 20%, rgba(200, 90, 50, 0.25) 0%, transparent 50%),
                            radial-gradient(circle at 20% 80%, rgba(209, 236, 219, 0.20) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl">
        {/* Ecological Protocol Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[12px] font-medium text-[#C1ECD4] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#FDEEE8]" />
          <span>Uttarakhand Eco-Carbon Protocol • IPCC Elevation Adjusted</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15]"
        >
          Travel Consciously Across the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C1ECD4] via-[#A3CCA9] to-[#FDEEE8]">Himalayan Ridge</span>
        </motion.h1>

        {/* Narrative Description */}
        <motion.p variants={itemVariants} className="mt-3.5 text-base sm:text-lg text-[#EDF6F0]/85 max-w-2xl leading-relaxed">
          High-altitude roads, hairpin bends, and delicate alpine valleys multiply travel carbon emissions by up to 1.8×. Measure your exact journey footprint, discover low-impact alternatives, and restore local mountain biomes.
        </motion.p>

        {/* Quick KPI Stat Chips */}
        <motion.div variants={itemVariants} className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#A3CCA9]">
              <Compass className="w-3.5 h-3.5" />
              <span>Journeys</span>
            </div>
            <p className="mt-1 text-2xl font-black tracking-tight text-white">1,482</p>
            <span className="text-[10.5px] text-white/60">Verified routes</span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#A3CCA9]">
              <MountainSnow className="w-3.5 h-3.5" />
              <span>Mitigated</span>
            </div>
            <p className="mt-1 text-2xl font-black tracking-tight text-white">214.8<span className="text-sm font-normal">t</span></p>
            <span className="text-[10.5px] text-white/60">Gross CO₂e offset</span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#A3CCA9]">
              <Trees className="w-3.5 h-3.5" />
              <span>Reforested</span>
            </div>
            <p className="mt-1 text-2xl font-black tracking-tight text-white">9,780</p>
            <span className="text-[10.5px] text-white/60">Oak &amp; Deodar planted</span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#A3CCA9]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Standard</span>
            </div>
            <p className="mt-1 text-2xl font-black tracking-tight text-white">ARAI</p>
            <span className="text-[10.5px] text-white/60">Verified factors</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
