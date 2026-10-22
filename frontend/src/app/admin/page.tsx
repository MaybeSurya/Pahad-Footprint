import React from 'react';
import { AdminDashboard } from '../../components/AdminDashboard';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">
          Regional Carbon Analytics &amp; Audit Log
        </h1>
        <p className="text-[14px] text-[#4B5563] mt-1">
          Statewide telemetry reconciliation, mountain corridor load monitoring, and Van Panchayat partner audits.
        </p>
      </div>

      <AdminDashboard />
    </div>
  );
}
