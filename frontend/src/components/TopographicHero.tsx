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
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-10 shadow-elevated border border-slate-700/60"
    >
      {/* Ambient Mountain Backdrop Contours */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen bg-repeat"
        style={{
          backgroundImage: `radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.22) 0%, transparent 45%),
                            radial-gradient(circle at 15% 85%, rgba(59, 130, 246, 0.18) 0%, transparent 55%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl">
        {/* Ecological Protocol Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-400/25 text-[12px] font-semibold text-emerald-300 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>Uttarakhand Eco-Carbon Protocol • IPCC Elevation Adjusted</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.18]"
        >
          Travel Consciously Across the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">Himalayan Ridge</span>
        </motion.h1>

        {/* Narrative Description */}
        <motion.p variants={itemVariants} className="mt-3.5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
          High-altitude roads, hairpin bends, and delicate alpine valleys multiply travel carbon emissions by up to 1.8×. Measure your exact journey footprint, discover low-impact alternatives, and restore local mountain biomes.
        </motion.p>

        {/* Quick KPI Stat Chips */}
        <motion.div variants={itemVariants} className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 transition-all hover:bg-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-400">
              <Compass className="w-3.5 h-3.5" />
              <span>Journeys</span>
            </div>
            <p className="mt-1 text-2xl font-black tracking-tight text-white">1,482</p>
            <span className="text-[11px] text-slate-400">Verified routes</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 transition-all hover:bg-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-amber-400">
              <MountainSnow className="w-3.5 h-3.5" />
              <span>Mitigated</span>
            </div>
            <p className="mt-1 text-2xl font-black tracking-tight text-white">214.8<span className="text-sm font-normal text-slate-300 ml-0.5">t</span></p>
            <span className="text-[11px] text-slate-400">Gross CO₂e offset</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 transition-all hover:bg-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-400">
              <Trees className="w-3.5 h-3.5" />
              <span>Reforested</span>
            </div>
            <p className="mt-1 text-2xl font-black tracking-tight text-white">9,780</p>
            <span className="text-[11px] text-slate-400">Oak &amp; Deodar planted</span>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 transition-all hover:bg-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Standard</span>
            </div>
            <p className="mt-1 text-2xl font-black tracking-tight text-white">ARAI</p>
            <span className="text-[11px] text-slate-400">Verified factors</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
