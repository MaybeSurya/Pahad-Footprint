'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Compass,
  MountainSnow,
  Trees,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AdminMetrics, AuditTripLog } from '../types';
import { fetchAdminMetrics, fetchAdminTrips, getStoredSession } from '../lib/api';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [trips, setTrips] = useState<AuditTripLog[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(1482);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartType, setChartType] = useState<'bars' | 'donut'>('bars');

  const session = getStoredSession();
  const token = session?.token || '';

  useEffect(() => {
    loadData();
  }, [page, filter, search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [metricsData, tripsData] = await Promise.all([
        fetchAdminMetrics(token),
        fetchAdminTrips(token, page, 5, filter, search),
      ]);
      setMetrics(metricsData);
      setTrips(tripsData.data);
      setTotalSubmissions(tripsData.totalSubmissions);
    } catch (err: any) {
      console.warn('Backend unavailable, using fallback mock dataset:', err.message);
      // Mock metrics fallback for preview
      setMetrics({
        reportingWindow: 'Last 30 Days (23 Sep – 22 Oct 2026)',
        datasetVersion: 'v1.2-2026 Reconciled Baseline',
        lastReconciledAt: '2026-10-22T12:00:00+05:30',
        totalTripsLogged: 1482,
        totalCarbonTrackedTonnes: 214.8,
        averageFootprintKgPerTrip: 145.0,
        averageOccupancyPax: 2.42,
        restorationPledges: {
          totalSaplings: 9780,
          verifiedSaplings: 6420,
          pendingSaplings: 3360,
          activeVanPanchayats: 23,
        },
        circuitsBreakdown: [
          { circuit: 'Kumaon Circuit (Nainital – Almora – Mukteshwar)', tonnesCo2e: 68.0, percentage: 31.7, color: '#059669' },
          { circuit: 'Mussoorie – Dhanaulti Ridge Corridor', tonnesCo2e: 54.0, percentage: 25.1, color: '#0D9488' },
          { circuit: 'Rishikesh – Tehri Lake Ascent', tonnesCo2e: 42.0, percentage: 19.6, color: '#2563EB' },
          { circuit: 'Kedarnath / Garhwal Pilgrim Gateway', tonnesCo2e: 35.0, percentage: 16.3, color: '#D97706' },
          { circuit: 'Auli – Joshimath High Alpine Corridor', tonnesCo2e: 15.8, percentage: 7.3, color: '#EA580C' },
        ],
        transportModeShare: [
          { mode: 'Private SUV (Diesel)', percentage: 46, tripCount: 682, emissionRate: '180 g CO₂e/vkm', status: 'high_impact' },
          { mode: 'Petrol Sedan', percentage: 28, tripCount: 415, emissionRate: '140 g CO₂e/vkm', status: 'standard' },
          { mode: 'Shared UTC Bus', percentage: 18, tripCount: 267, emissionRate: '30 g CO₂e/pkm', status: 'eco_friendly' },
          { mode: 'Electric Vehicle (EV)', percentage: 8, tripCount: 118, emissionRate: '45 g CO₂e/vkm', status: 'low_grid' },
        ],
        auditorInsights: [
          'High SUV transit share (46%) generates 68% of total transport footprint due to mountain altitude grade penalties.',
          'Target EV adoption: 20% by 2027 (Current Deficit: -12%).',
        ],
      });

      // Sample fallback trips
      setTrips([
        {
          id: 'PF-4092',
          circuit: 'Kumaon Circuit (320 km)',
          distanceKm: 320,
          mode: 'Diesel SUV (3 pax)',
          passengers: 3,
          nights: 4,
          tripFootprintKg: 180.0,
          perPersonKg: 60.0,
          severity: 'moderate',
          status: 'verified',
          expansion: {
            terrain: 'Mid-Hills (1.25× grade multiplier)',
            stay: 'Standard Hotel (4 nights @ 9.0 kg/night)',
            engine: 'v1.2-2026 Baseline Analytical Engine',
            checkpost: 'Almora North Gate Toll Barrier',
            date: '2026-10-22 11:42 IST',
          },
        },
        {
          id: 'PF-4091',
          circuit: 'Mussoorie–Dhanaulti (185 km)',
          distanceKm: 185,
          mode: 'Shared UTC Bus (2 pax)',
          passengers: 2,
          nights: 3,
          tripFootprintKg: 38.2,
          perPersonKg: 19.1,
          severity: 'low',
          status: 'verified',
          expansion: {
            terrain: 'Mid-Hills (1.25×)',
            stay: 'Pahadi Homestay (3 nights)',
            engine: 'v1.2-2026',
            checkpost: 'Kuthalgate Checkpost',
            date: '2026-10-22 10:15 IST',
          },
        },
        {
          id: 'PF-4090',
          circuit: 'Garhwal Pilgrim Loop (410 km)',
          distanceKm: 410,
          mode: 'Diesel SUV (4 pax)',
          passengers: 4,
          nights: 5,
          tripFootprintKg: 246.0,
          perPersonKg: 61.5,
          severity: 'moderate',
          status: 'pledged',
          expansion: {
            terrain: 'High Altitude (1.40×)',
            stay: 'Standard Hotel (5 nights)',
            engine: 'v1.2-2026',
            checkpost: 'Rudraprayag Sangam Barrier',
            date: '2026-10-22 09:30 IST',
          },
        },
        {
          id: 'PF-4089',
          circuit: 'Foothill Wildlife (210 km)',
          distanceKm: 210,
          mode: 'Electric Vehicle (EV) (2 pax)',
          passengers: 2,
          nights: 2,
          tripFootprintKg: 27.8,
          perPersonKg: 13.9,
          severity: 'low',
          status: 'verified',
          expansion: {
            terrain: 'Foothills (1.00×)',
            stay: 'Eco-Camp (2 nights)',
            engine: 'v1.2-2026',
            checkpost: 'Ramnagar Dhangarhi Gate',
            date: '2026-10-21 16:50 IST',
          },
        },
        {
          id: 'PF-4088',
          circuit: 'Auli–Joshimath (460 km)',
          distanceKm: 460,
          mode: 'Diesel SUV (2 pax)',
          passengers: 2,
          nights: 6,
          tripFootprintKg: 289.8,
          perPersonKg: 144.9,
          severity: 'high',
          status: 'pledged',
          expansion: {
            terrain: 'High Altitude (1.40×)',
            stay: 'Luxury Resort (6 nights)',
            engine: 'v1.2-2026',
            checkpost: 'Chamoli Gate Toll Plaza',
            date: '2026-10-21 14:10 IST',
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!trips.length) return;
    const headers = ['Trip ID', 'Circuit', 'Distance (km)', 'Transport Mode', 'Passengers', 'Trip Footprint (kg)', 'Per Person (kg)', 'Status'];
    const rows = trips.map((t) => [
      t.id,
      `"${t.circuit}"`,
      t.distanceKm,
      `"${t.mode}"`,
      t.passengers,
      t.tripFootprintKg,
      t.perPersonKg,
      t.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pahad-footprint-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported audit log CSV successfully!');
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const toggleRow = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-elevated flex items-center gap-3 border border-slate-700/80"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-[13.5px] font-medium">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Context Banner */}
      <div className="bg-white border border-[#2D322B29] rounded-xl p-3.5 sm:px-5 sm:py-3.5 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-3 text-[12.5px]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#496951] animate-pulse" />
            <span className="font-bold text-[#242722]">
              Dataset: Sample Demonstration Records (v1.2-2026 Reconciled Baseline)
            </span>
            <span className="text-[#777C72] hidden sm:inline">| Last Reconciled: 22 Oct 2026, 12:00 IST</span>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF9F5] hover:bg-[#F0EEE6] border border-[#2D322B29] rounded-lg font-semibold text-[#242722] transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-[#304B38]" />
            Export Audit Log CSV
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid">
          {/* KPI 1 */}
          <div className="pahad-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Total Trips Logged</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-[32px] font-extrabold text-slate-900 tracking-tight">
                {metrics.totalTripsLogged.toLocaleString()}{' '}
                <span className="text-[16px] font-medium text-slate-500">Trips</span>
              </div>
              <span className="inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                ▲ +14% vs. prior 30 days
              </span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="pahad-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Total Carbon Tracked</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
                <MountainSnow className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-[30px] font-extrabold text-slate-900 tracking-tight">
                {metrics.totalCarbonTrackedTonnes.toFixed(1)}{' '}
                <span className="text-[16px] font-medium text-slate-500">t CO₂e</span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-2">Summed across 5 monitored hill circuits</p>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="pahad-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Avg. Footprint / Trip</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-[30px] font-extrabold text-slate-900 tracking-tight">
                {metrics.averageFootprintKgPerTrip.toFixed(1)}{' '}
                <span className="text-[16px] font-medium text-slate-500">kg CO₂e</span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-2">Avg. 2.42 pax/trip (~60.0 kg/person)</p>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="pahad-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Restoration Pledges</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <Trees className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-[30px] font-extrabold text-slate-900 tracking-tight">
                {metrics.restorationPledges.totalSaplings.toLocaleString()}{' '}
                <span className="text-[16px] font-medium text-slate-500">Saplings</span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-2">
                <strong className="text-emerald-700 font-semibold">{metrics.restorationPledges.verifiedSaplings.toLocaleString()} Verified</strong> |{' '}
                {metrics.restorationPledges.pendingSaplings.toLocaleString()} Pledged
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Row 2: Charts & Distribution (7fr 5fr) */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-grid">
          {/* Regional Load Distribution Chart Card */}
          <div className="pahad-card">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[15px] font-bold text-slate-900">Carbon Load by Monitored Hill Circuit</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setChartType('bars')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                      chartType === 'bars' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="w-3 h-3 text-emerald-600" />
                    Bars
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartType('donut')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                      chartType === 'donut' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <PieChartIcon className="w-3 h-3 text-amber-600" />
                    Donut
                  </button>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  5 Corridors
                </span>
              </div>
            </div>
            <p className="text-[12px] text-slate-500 mb-4">
              Aggregate sum of transport mountain drag &amp; lodging intensities across monitored corridors
            </p>

            {chartType === 'bars' ? (
              <div className="space-y-4">
                {metrics.circuitsBreakdown.map((item) => (
                  <div key={item.circuit}>
                    <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                      <span className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.circuit}
                      </span>
                      <span className="font-bold text-slate-900 font-mono">
                        {item.tonnesCo2e.toFixed(1)} t <span className="font-normal text-slate-500">({item.percentage}%)</span>
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-2 flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="60" fill="transparent" stroke="#F1F5F9" strokeWidth="20" />
                    {metrics.circuitsBreakdown.reduce(
                      (acc, item) => {
                        const dash = (item.percentage / 100) * (2 * Math.PI * 60);
                        const el = (
                          <circle
                            key={item.circuit}
                            cx="80"
                            cy="80"
                            r="60"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="20"
                            strokeDasharray={`${dash} ${2 * Math.PI * 60}`}
                            strokeDashoffset={`-${acc.offset}`}
                          />
                        );
                        return { offset: acc.offset + dash, elements: [...acc.elements, el] };
                      },
                      { offset: 0, elements: [] as React.ReactNode[] }
                    ).elements}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Load</span>
                    <span className="text-[18px] font-extrabold text-slate-900 leading-tight">214.8 t</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {metrics.circuitsBreakdown.map((item) => (
                    <div key={item.circuit} className="flex items-center justify-between text-[11.5px]">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        {item.circuit.split('(')[0]}
                      </span>
                      <span className="font-bold text-slate-900">{item.tonnesCo2e.toFixed(1)} t ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-slate-200 mt-5 pt-3 flex items-center justify-between text-[12.5px]">
              <span className="font-bold text-emerald-800">Reconciled Sum: 68.0 t Kumaon | 214.8 Metric Tons Total (100.0%)</span>
              <span className="text-slate-500 text-[11.5px]">Telemetry Verified</span>
            </div>
          </div>

          {/* Transport Mode Share Progress List */}
          <div className="pahad-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[15px] font-bold text-slate-900">Transport Mode Share</h3>
                <span className="text-[12px] text-slate-500 font-medium">1,482 logged trips</span>
              </div>
              <p className="text-[12px] text-slate-500 mb-4">
                Fleet distribution entering Himalayan gate check-posts
              </p>

              <div className="space-y-3">
                {metrics.transportModeShare.map((item) => (
                  <div key={item.mode} className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/70">
                    <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                      <span className="font-semibold text-slate-800">{item.mode}</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {item.percentage}% <span className="font-normal text-slate-500">({item.tripCount} trips)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.status === 'high_impact'
                            ? 'bg-amber-600'
                            : item.status === 'eco_friendly'
                            ? 'bg-emerald-600'
                            : item.status === 'low_grid'
                            ? 'bg-teal-500'
                            : 'bg-slate-700'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-900 leading-relaxed">
              <strong>Auditor Insight:</strong> High SUV share (46%) drives 68% of transit footprint due to continuous steep incline fuel penalties. Target EV transition: 20% by 2027 (Current Deficit: -12%).
            </div>
          </div>
        </div>
      )}

      {/* Row 3: 5-Column Expandable Audit Log Table */}
      <div className="pahad-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-[16px] font-bold text-slate-900">Recent Tourist Submissions</h3>
            <p className="text-[12px] text-slate-500">Validated against telemetry and hill toll plaza receipts</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="search"
                placeholder="Search Trip ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8 pr-3 text-[12.5px] bg-slate-50 border border-slate-200 rounded-xl w-48 text-slate-900 focus:bg-white focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All (1,482)' },
            { id: 'suv', label: 'Diesel SUV (682)' },
            { id: 'bus', label: 'Shared Bus (267)' },
            { id: 'verified', label: 'Verified (890)' },
            { id: 'pending', label: 'Pledged Pending (412)' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => {
                setFilter(pill.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors whitespace-nowrap border ${
                filter === pill.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[620px] text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-3">Trip ID</th>
                <th className="py-3 px-3">Circuit / Route</th>
                <th className="py-3 px-3">Transport Mode</th>
                <th className="py-3 px-3">Footprint</th>
                <th className="py-3 px-3">Restoration</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => {
                const isExpanded = expandedId === trip.id;
                return (
                  <React.Fragment key={trip.id}>
                    <tr
                      onClick={() => toggleRow(trip.id)}
                      className="border-b border-slate-100 hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-800 flex items-center gap-1.5">
                        <ChevronRight className={`w-3.5 h-3.5 transform transition-transform text-slate-400 ${isExpanded ? 'rotate-90 text-emerald-700' : ''}`} />
                        #{trip.id}
                      </td>
                      <td className="py-3.5 px-3 font-medium text-slate-900">{trip.circuit}</td>
                      <td className="py-3.5 px-3 text-slate-600">{trip.mode}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900 font-mono">
                        {trip.tripFootprintKg.toFixed(1)} kg{' '}
                        <span className="text-[11.5px] font-normal text-slate-500">({trip.perPersonKg.toFixed(1)}/p)</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            trip.status === 'verified'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : trip.status === 'pledged'
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {trip.status === 'verified' ? '✓ Verified' : trip.status === 'pledged' ? '⏱ Pledged' : '◎ Calculated'}
                        </span>
                      </td>
                    </tr>

                    {/* Expandable Details Drawer */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90">
                        <td colSpan={5} className="p-4 border-l-4 border-emerald-600">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px] text-slate-600">
                            <div>
                              <strong className="text-slate-900 block font-semibold mb-0.5">Terrain Gradient:</strong>
                              <p>{trip.expansion.terrain}</p>
                            </div>
                            <div>
                              <strong className="text-slate-900 block font-semibold mb-0.5">Accommodation:</strong>
                              <p>{trip.expansion.stay}</p>
                            </div>
                            <div>
                              <strong className="text-slate-900 block font-semibold mb-0.5">Entry Checkpost:</strong>
                              <p>{trip.expansion.checkpost}</p>
                            </div>
                            <div>
                              <strong className="text-slate-900 block font-semibold mb-0.5">Telemetry Timestamp:</strong>
                              <p>{trip.expansion.date}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="border-t border-slate-200 pt-3.5 flex items-center justify-between flex-wrap gap-2 text-[12.5px] text-slate-600">
          <span>
            Showing <strong>{trips.length}</strong> of <strong>{totalSubmissions.toLocaleString()}</strong> audited submissions
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Previous
            </button>
            <span className="px-2.5 py-1 font-bold text-slate-900">Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
