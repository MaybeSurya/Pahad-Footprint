'use client';

import React, { useState, useEffect } from 'react';
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
          { circuit: 'Kumaon Circuit (Nainital – Almora – Mukteshwar)', tonnesCo2e: 68.0, percentage: 31.7, color: '#1B4332' },
          { circuit: 'Mussoorie – Dhanaulti Ridge Corridor', tonnesCo2e: 54.0, percentage: 25.1, color: '#2D6A4F' },
          { circuit: 'Rishikesh – Tehri Lake Ascent', tonnesCo2e: 42.0, percentage: 19.6, color: '#40916C' },
          { circuit: 'Kedarnath / Garhwal Pilgrim Gateway', tonnesCo2e: 35.0, percentage: 16.3, color: '#52B788' },
          { circuit: 'Auli – Joshimath High Alpine Corridor', tonnesCo2e: 15.8, percentage: 7.3, color: '#74C69D' },
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
          status: 'pledged',
          expansion: {
            terrain: 'Mid-Hills (1.25× grade multiplier)',
            stay: 'Pahadi Homestay (3 nights @ 6.0 kg/night)',
            engine: 'v1.2-2026 Baseline',
            checkpost: 'Kincraig Checkpost, Mussoorie',
            date: '2026-10-22 10:15 IST',
          },
        },
        {
          id: 'PF-4090',
          circuit: 'Rishikesh–Tehri (210 km)',
          distanceKm: 210,
          mode: 'Petrol Sedan (4 pax)',
          passengers: 4,
          nights: 3,
          tripFootprintKg: 112.4,
          perPersonKg: 28.1,
          severity: 'low',
          status: 'calculated',
          expansion: {
            terrain: 'Mid-Hills (1.25×)',
            stay: 'Standard Hotel (3 nights)',
            engine: 'v1.2-2026 Baseline',
            checkpost: 'Devprayag Toll Terminal',
            date: '2026-10-22 09:20 IST',
          },
        },
        {
          id: 'PF-4089',
          circuit: 'Auli–Joshimath (460 km)',
          distanceKm: 460,
          mode: 'Electric Vehicle (2 pax)',
          passengers: 2,
          nights: 5,
          tripFootprintKg: 64.8,
          perPersonKg: 32.4,
          severity: 'low',
          status: 'verified',
          expansion: {
            terrain: 'High Altitude (1.40× elevation multiplier)',
            stay: 'Pahadi Homestay (5 nights)',
            engine: 'v1.2-2026',
            checkpost: 'Joshimath Alpine Entry Gate',
            date: '2026-10-21 16:55 IST',
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
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B4332] text-white px-5 py-3 rounded-btn shadow-elevated flex items-center gap-3">
          <svg className="w-5 h-5 text-[#C1ECD4] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[13.5px] font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Admin Context Banner */}
      <div className="bg-[#EDF6F0] border-y border-[#D8E8DF] py-2.5 px-6 -mx-6">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between flex-wrap gap-2 text-[12px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-semibold text-[#1B4332]">
              Dataset: Sample Demonstration Records (v1.2-2026 Reconciled Baseline)
            </span>
            <span className="text-[#4B5563]">| Last Reconciled: 22 Oct 2026, 12:00 IST</span>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#D8E8DF] border border-[#D8E8DF] rounded-btn font-semibold text-[#1B4332] transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Audit Log CSV
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid">
          {/* KPI 1 */}
          <div className="pahad-card-mist flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Total Trips Logged</span>
              <div className="w-8 h-8 rounded-lg bg-white border border-[#D8E8DF] flex items-center justify-center text-[#1B4332]">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-[32px] font-extrabold text-[#111827] tracking-tight">
                {metrics.totalTripsLogged.toLocaleString()}{' '}
                <span className="text-[16px] font-medium text-[#4B5563]">Trips</span>
              </div>
              <span className="inline-block mt-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#C1ECD4] text-[#002114] border border-[#A3CCA9]">
                ▲ +14% vs. prior 30 days
              </span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="pahad-card-mist flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Total Carbon Tracked</span>
              <div className="w-8 h-8 rounded-lg bg-white border border-[#D8E8DF] flex items-center justify-center text-[#1B4332]">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-[30px] font-extrabold text-[#111827] tracking-tight">
                {metrics.totalCarbonTrackedTonnes.toFixed(1)}{' '}
                <span className="text-[16px] font-medium text-[#4B5563]">t CO₂e</span>
              </div>
              <p className="text-[11.5px] text-[#4B5563] mt-2">Summed across 5 monitored hill circuits</p>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="pahad-card-mist flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Avg. Footprint / Trip</span>
              <div className="w-8 h-8 rounded-lg bg-white border border-[#D8E8DF] flex items-center justify-center text-[#1B4332]">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-[30px] font-extrabold text-[#111827] tracking-tight">
                {metrics.averageFootprintKgPerTrip.toFixed(1)}{' '}
                <span className="text-[16px] font-medium text-[#4B5563]">kg CO₂e</span>
              </div>
              <p className="text-[11.5px] text-[#4B5563] mt-2">Avg. 2.42 pax/trip (~60.0 kg/person)</p>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="pahad-card-mist flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Restoration Pledges</span>
              <div className="w-8 h-8 rounded-lg bg-white border border-[#D8E8DF] flex items-center justify-center text-[#1B4332]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L6 10h3.5v5H8v4h8v-4h-1.5v-5H18L12 2z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-[30px] font-extrabold text-[#111827] tracking-tight">
                {metrics.restorationPledges.totalSaplings.toLocaleString()}{' '}
                <span className="text-[16px] font-medium text-[#4B5563]">Saplings</span>
              </div>
              <p className="text-[11.5px] text-[#4B5563] mt-2">
                <strong className="text-[#1B4332]">{metrics.restorationPledges.verifiedSaplings.toLocaleString()} Verified</strong> |{' '}
                {metrics.restorationPledges.pendingSaplings.toLocaleString()} Pledged
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Row 2: Charts & Distribution (7fr 5fr) */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-grid">
          {/* Regional Load Distribution Bar Chart */}
          <div className="pahad-card">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[15px] font-bold text-[#111827]">Carbon Load by Monitored Hill Circuit</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#C1ECD4] text-[#002114]">
                5 Corridors
              </span>
            </div>
            <p className="text-[12px] text-[#4B5563] mb-4">
              Aggregate sum of transport mountain drag &amp; lodging intensities across monitored corridors
            </p>

            <div className="space-y-4">
              {metrics.circuitsBreakdown.map((item) => (
                <div key={item.circuit}>
                  <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                    <span className="font-semibold text-[#111827] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.circuit}
                    </span>
                    <span className="font-bold text-[#111827]">
                      {item.tonnesCo2e.toFixed(1)} t <span className="font-normal text-[#4B5563]">({item.percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#EDF6F0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#D8E8DF] mt-5 pt-3 flex items-center justify-between text-[12.5px]">
              <span className="font-bold text-[#1B4332]">Reconciled Sum: 214.8 Metric Tons CO₂e (100.0%)</span>
              <span className="text-[#4B5563] text-[11.5px]">Telemetry Verified</span>
            </div>
          </div>

          {/* Transport Mode Share Progress List */}
          <div className="pahad-card">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[15px] font-bold text-[#111827]">Transport Mode Share</h3>
              <span className="text-[12px] text-[#4B5563]">1,482 logged trips</span>
            </div>
            <p className="text-[12px] text-[#4B5563] mb-4">
              Fleet distribution entering Himalayan gate check-posts
            </p>

            <div className="space-y-3">
              {metrics.transportModeShare.map((item) => (
                <div key={item.mode} className="p-2.5 rounded-lg border border-[#D8E8DF] bg-[#F8FAF9]">
                  <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                    <span className="font-semibold text-[#111827]">{item.mode}</span>
                    <span className="font-bold text-[#111827]">
                      {item.percentage}% <span className="font-normal text-[#4B5563]">({item.tripCount} trips)</span>
                    </span>
                  </div>
                  <div className="h-2 bg-[#D8E8DF] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.status === 'high_impact'
                          ? 'bg-[#1B4332]'
                          : item.status === 'eco_friendly'
                          ? 'bg-[#16A34A]'
                          : item.status === 'low_grid'
                          ? 'bg-[#52B788]'
                          : 'bg-[#2D6A4F]'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg text-[11.5px] text-[#78350F] leading-relaxed">
              <strong>Auditor Insight:</strong> High SUV share (46%) drives 68% of transit footprint due to continuous steep incline fuel penalties. Target EV transition: 20% by 2027 (Current Deficit: -12%).
            </div>
          </div>
        </div>
      )}

      {/* Row 3: 5-Column Expandable Audit Log Table */}
      <div className="pahad-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-[15px] font-bold text-[#111827]">Recent Tourist Submissions</h3>
            <p className="text-[12px] text-[#4B5563]">Validated against telemetry and hill toll plaza receipts</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="search"
              placeholder="Search Trip ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 px-3 text-[12.5px] bg-white border border-[#D8E8DF] rounded-input w-48"
            />
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
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors whitespace-nowrap border ${
                filter === pill.id
                  ? 'bg-[#1B4332] text-white border-[#1B4332]'
                  : 'bg-white text-[#4B5563] border-[#D8E8DF] hover:bg-[#EDF6F0]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b-2 border-[#D8E8DF] text-[11px] font-bold uppercase tracking-wider text-[#4B5563]">
                <th className="py-2.5 px-3">Trip ID</th>
                <th className="py-2.5 px-3">Circuit / Route</th>
                <th className="py-2.5 px-3">Transport Mode</th>
                <th className="py-2.5 px-3">Footprint</th>
                <th className="py-2.5 px-3">Restoration</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => {
                const isExpanded = expandedId === trip.id;
                return (
                  <React.Fragment key={trip.id}>
                    <tr
                      onClick={() => toggleRow(trip.id)}
                      className="border-b border-[#D8E8DF]/60 hover:bg-[#EDF6F0]/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-[#1B4332] flex items-center gap-1.5">
                        <svg
                          className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        #{trip.id}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#111827]">{trip.circuit}</td>
                      <td className="py-3 px-3 text-[#4B5563]">{trip.mode}</td>
                      <td className="py-3 px-3 font-semibold text-[#111827]">
                        {trip.tripFootprintKg.toFixed(1)} kg{' '}
                        <span className="text-[11.5px] font-normal text-[#4B5563]">({trip.perPersonKg.toFixed(1)}/p)</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                            trip.status === 'verified'
                              ? 'bg-[#C1ECD4] text-[#002114] border-[#A3CCA9]'
                              : trip.status === 'pledged'
                              ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                              : 'bg-[#F3F4F6] text-[#374151] border-[#D1D5DB]'
                          }`}
                        >
                          {trip.status === 'verified' ? '✓ Verified' : trip.status === 'pledged' ? '⏱ Pledged' : '◎ Calculated'}
                        </span>
                      </td>
                    </tr>

                    {/* Expandable Details Drawer */}
                    {isExpanded && (
                      <tr className="bg-[#EDF6F0]/80">
                        <td colSpan={5} className="p-3 border-l-4 border-[#1B4332]">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11.5px] text-[#4B5563]">
                            <div>
                              <strong className="text-[#1B4332]">Terrain Gradient:</strong>
                              <p>{trip.expansion.terrain}</p>
                            </div>
                            <div>
                              <strong className="text-[#1B4332]">Accommodation:</strong>
                              <p>{trip.expansion.stay}</p>
                            </div>
                            <div>
                              <strong className="text-[#1B4332]">Entry Checkpost:</strong>
                              <p>{trip.expansion.checkpost}</p>
                            </div>
                            <div>
                              <strong className="text-[#1B4332]">Telemetry Timestamp:</strong>
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
        <div className="border-t border-[#D8E8DF] pt-3 flex items-center justify-between flex-wrap gap-2 text-[12px] text-[#4B5563]">
          <span>
            Showing <strong>{trips.length}</strong> of <strong>{totalSubmissions.toLocaleString()}</strong> audited submissions
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-2.5 py-1 rounded-btn border border-[#D8E8DF] bg-white disabled:opacity-40 hover:bg-[#EDF6F0]"
            >
              Previous
            </button>
            <span className="px-2 py-1 font-bold text-[#1B4332]">Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-2.5 py-1 rounded-btn border border-[#D8E8DF] bg-white hover:bg-[#EDF6F0]"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
