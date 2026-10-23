'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Download,
  Search,
  CheckCircle2,
  Trees,
  ShieldCheck,
  CreditCard,
  HeartHandshake,
  Award,
  QrCode,
  Compass,
  Calendar,
  User,
  ExternalLink,
  RefreshCw,
  MapPin,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import {
  getStoredActivityLogs,
  getActivityStats,
  ActivityLog,
  ActivityType,
} from '../lib/activityLogs';

export const AdminDashboard: React.FC = () => {
  const { language } = useTranslation();

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState(getActivityStats());
  const [activeTab, setActiveTab] = useState<'all' | ActivityType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const refreshLogs = () => {
    setLogs(getStoredActivityLogs());
    setStats(getActivityStats());
  };

  useEffect(() => {
    refreshLogs();

    const handleNewActivity = () => refreshLogs();
    window.addEventListener('pahad_activity_logged', handleNewActivity);
    window.addEventListener('storage', handleNewActivity);

    return () => {
      window.removeEventListener('pahad_activity_logged', handleNewActivity);
      window.removeEventListener('storage', handleNewActivity);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter logs by tab & search query
  const filteredLogs = logs.filter((log) => {
    const matchesTab = activeTab === 'all' || log.type === activeTab;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      log.travelerName.toLowerCase().includes(query) ||
      log.id.toLowerCase().includes(query) ||
      (log.certificateId && log.certificateId.toLowerCase().includes(query)) ||
      (log.division && log.division.toLowerCase().includes(query)) ||
      (log.route && log.route.toLowerCase().includes(query));

    return matchesTab && matchesQuery;
  });

  const exportAsCSV = () => {
    const headers = ['ID', 'Type', 'Title', 'Traveler Name', 'Trees', 'Amount (INR)', 'Certificate ID', 'Division / Route', 'Status', 'Timestamp'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.type,
      `"${l.title}"`,
      `"${l.travelerName}"`,
      l.trees || '',
      l.amount || '',
      l.certificateId || '',
      `"${l.division || l.route || ''}"`,
      l.status,
      l.timestamp,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pahad_admin_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Activity logs exported to CSV successfully!');
  };

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pahad_admin_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Activity logs exported to JSON successfully!');
  };

  const getBadgeStyle = (type: ActivityType) => {
    switch (type) {
      case 'donation':
        return 'bg-[#E8EDE5] text-[#304B38] border-[#496951]/30';
      case 'pledge':
        return 'bg-[#F1EADD] text-[#8A5D2E] border-[#B3834D]/30';
      case 'certificate':
        return 'bg-[#FAF9F5] text-[#242722] border-[#242722]/20 font-bold';
      case 'trip':
        return 'bg-[#F0EEE6] text-[#51554D] border-[#2D322B29]';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-elevated flex items-center gap-2.5 bg-[#242722] text-white border border-[#496951]/40 text-[13px] font-medium backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-[#E8EDE5]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. Tree Plantation & Restoration Stats Command Center ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-[20px] sm:text-[24px] font-bold text-[#242722] tracking-tight">
              {language === 'HI' ? 'उत्तराखंड पौधारोपण एवं प्रगति' : 'Tree Planting & Forest Progress'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshLogs}
              className="px-3 py-1.5 rounded border border-[#2D322B29] bg-white hover:bg-[#F0EEE6] text-[12px] font-mono text-[#51554D] flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <RefreshCw className="w-3 h-3 text-[#496951]" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 6 Grid Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
          {/* Metric 1 */}
          <div className="journal-card p-4 space-y-1">
            <span className="font-mono text-[10.5px] uppercase text-[#777C72] block">
              Total Trees Supported
            </span>
            <div className="font-mono text-[24px] sm:text-[28px] font-bold text-[#304B38] leading-none">
              {stats.totalTreesSupported.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#51554D] block mt-1">
              Banj Oak & Rhododendron
            </span>
          </div>

          {/* Metric 2 */}
          <div className="journal-card p-4 space-y-1">
            <span className="font-mono text-[10.5px] uppercase text-[#777C72] block">
              NGO Donations
            </span>
            <div className="font-mono text-[24px] sm:text-[28px] font-bold text-[#8A5D2E] leading-none">
              ₹{stats.totalDonationAmount.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#51554D] block mt-1">
              {stats.totalDonatedTrees.toLocaleString()} Trees Funded
            </span>
          </div>

          {/* Metric 3 */}
          <div className="journal-card p-4 space-y-1">
            <span className="font-mono text-[10.5px] uppercase text-[#777C72] block">
              Traveler Pledges
            </span>
            <div className="font-mono text-[24px] sm:text-[28px] font-bold text-[#242722] leading-none">
              {stats.totalPledgedTrees.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#51554D] block mt-1">
              Self-Planting Commitments
            </span>
          </div>

          {/* Metric 4 */}
          <div className="journal-card p-4 space-y-1">
            <span className="font-mono text-[10.5px] uppercase text-[#777C72] block">
              Certificates Issued
            </span>
            <div className="font-mono text-[24px] sm:text-[28px] font-bold text-[#304B38] leading-none">
              {stats.totalCertificatesIssued.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#51554D] block mt-1 flex items-center gap-1">
              <QrCode className="w-3 h-3 text-[#496951]" />
              <span>100% QR Verified</span>
            </span>
          </div>

          {/* Metric 5 */}
          <div className="journal-card p-4 space-y-1">
            <span className="font-mono text-[10.5px] uppercase text-[#777C72] block">
              2-Yr Survival Rate
            </span>
            <div className="font-mono text-[24px] sm:text-[28px] font-bold text-[#304B38] leading-none">
              {stats.survivalRate}%
            </div>
            <span className="text-[11px] text-[#51554D] block mt-1">
              Monitored by Councils
            </span>
          </div>

          {/* Metric 6 */}
          <div className="journal-card p-4 space-y-1">
            <span className="font-mono text-[10.5px] uppercase text-[#777C72] block">
              Active Van Panchayats
            </span>
            <div className="font-mono text-[24px] sm:text-[28px] font-bold text-[#242722] leading-none">
              {stats.activeVanPanchayats}
            </div>
            <span className="text-[11px] text-[#51554D] block mt-1">
              {stats.hectaresCovered} Hectares Covered
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Activity Logs & Registry System ── */}
      <div className="journal-card p-5 sm:p-6 space-y-5">
        {/* Header and Filter Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--line)' }}>
          <div>
            <h3 className="text-[18px] font-bold text-[#242722] tracking-tight">
              {language === 'HI' ? 'हाल की गतिविधियां (दान, संकल्प, प्रमाण पत्र)' : 'Recent Activities (Donations, Pledges, Certificates)'}
            </h3>
            <p className="text-[12.5px] text-[#777C72] mt-0.5">
              Showing {filteredLogs.length} logged entries across Garhwal & Kumaon divisions
            </p>
          </div>

          {/* Export and Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={exportAsCSV}
              className="px-3 py-1.5 rounded border border-[#2D322B29] bg-white hover:bg-[#F0EEE6] text-[12px] font-semibold text-[#242722] flex items-center gap-1.5 shadow-xs transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#496951]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={exportAsJSON}
              className="px-3 py-1.5 rounded border border-[#2D322B29] bg-white hover:bg-[#F0EEE6] text-[12px] font-semibold text-[#242722] flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#8A5D2E]" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex rounded bg-[#F0EEE6] p-1 border border-[#2D322B29] gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`py-1 px-3 rounded text-[11.5px] sm:text-[12px] font-semibold whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-[#242722] shadow-xs font-bold'
                  : 'text-[#51554D] hover:text-[#242722]'
              }`}
            >
              All Logs ({logs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('donation')}
              className={`py-1 px-3 rounded text-[11.5px] sm:text-[12px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
                activeTab === 'donation'
                  ? 'bg-white text-[#304B38] shadow-xs font-bold'
                  : 'text-[#51554D] hover:text-[#242722]'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>Donations ({logs.filter((l) => l.type === 'donation').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pledge')}
              className={`py-1 px-3 rounded text-[11.5px] sm:text-[12px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
                activeTab === 'pledge'
                  ? 'bg-white text-[#8A5D2E] shadow-xs font-bold'
                  : 'text-[#51554D] hover:text-[#242722]'
              }`}
            >
              <Trees className="w-3 h-3" />
              <span>Pledges ({logs.filter((l) => l.type === 'pledge').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('certificate')}
              className={`py-1 px-3 rounded text-[11.5px] sm:text-[12px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
                activeTab === 'certificate'
                  ? 'bg-white text-[#242722] shadow-xs font-bold'
                  : 'text-[#51554D] hover:text-[#242722]'
              }`}
            >
              <Award className="w-3 h-3" />
              <span>Certificates ({logs.filter((l) => l.type === 'certificate').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trip')}
              className={`py-1 px-3 rounded text-[11.5px] sm:text-[12px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
                activeTab === 'trip'
                  ? 'bg-white text-[#242722] shadow-xs font-bold'
                  : 'text-[#51554D] hover:text-[#242722]'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Trips ({logs.filter((l) => l.type === 'trip').length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777C72]" />
            <input
              type="text"
              placeholder="Search traveler, certificate, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-white border border-[#2D322B29] rounded text-[12.5px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto rounded border border-[#2D322B1F]">
          <table className="w-full text-left text-[12.5px] border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#2D322B1F] font-mono text-[10.5px] text-[#777C72] uppercase">
                <th className="py-2.5 px-3">Log ID / Type</th>
                <th className="py-2.5 px-3">Traveler / Participant</th>
                <th className="py-2.5 px-3">Activity Summary</th>
                <th className="py-2.5 px-3">Trees / Amount</th>
                <th className="py-2.5 px-3">Division / Certificate</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D322B14] bg-white">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#777C72] font-mono text-[12px]">
                    No activity logs match your filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                    className="hover:bg-[#FAF9F5] cursor-pointer transition-colors"
                  >
                    {/* Log ID & Type badge */}
                    <td className="py-3 px-3">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-[11px] text-[#242722] block">
                          {log.id}
                        </span>
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[9.5px] font-mono uppercase border ${getBadgeStyle(
                            log.type
                          )}`}
                        >
                          {log.type}
                        </span>
                      </div>
                    </td>

                    {/* Traveler Name */}
                    <td className="py-3 px-3 font-semibold text-[#242722]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#777C72]" />
                        <span>{log.travelerName}</span>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3 px-3 text-[#51554D]">
                      <span>{log.title}</span>
                      {log.route && (
                        <span className="block font-mono text-[10.5px] text-[#777C72]">
                          {log.route}
                        </span>
                      )}
                    </td>

                    {/* Trees or Amount */}
                    <td className="py-3 px-3">
                      {log.amount && (
                        <span className="font-mono font-bold text-[#8A5D2E] block">
                          ₹{log.amount.toLocaleString()}
                        </span>
                      )}
                      {log.trees && (
                        <span className="font-mono text-[#304B38] font-bold block text-[11.5px]">
                          🌲 {log.trees} Trees
                        </span>
                      )}
                      {log.co2eKg && (
                        <span className="font-mono text-[#51554D] block text-[11px]">
                          {log.co2eKg} kg CO₂e
                        </span>
                      )}
                    </td>

                    {/* Certificate or Division */}
                    <td className="py-3 px-3">
                      {log.certificateId ? (
                        <Link
                          href={`/verify?cert=${encodeURIComponent(log.certificateId)}&name=${encodeURIComponent(
                            log.travelerName
                          )}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-[11px] font-bold text-[#304B38] hover:underline flex items-center gap-1"
                        >
                          <span>{log.certificateId}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      ) : (
                        <span className="text-[11.5px] text-[#777C72]">
                          {log.division || 'Statewide Corridor'}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{log.status.toUpperCase()}</span>
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-3 text-right font-mono text-[11px] text-[#777C72] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
