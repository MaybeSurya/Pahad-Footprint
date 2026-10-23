import React from 'react';
import { AdminDashboard } from '../../components/AdminDashboard';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="section-kicker mb-1">
          <span>// AUDITOR CONSOLE · RECONCILED TELEMETRY</span>
        </div>
        <h1
          className="text-[26px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-tight"
          style={{ color: 'var(--ink)' }}
        >
          Regional Carbon Analytics &amp; Audit Log
        </h1>
        <p
          className="text-[13.5px] mt-1 max-w-2xl leading-relaxed"
          style={{ color: 'var(--ink-soft)' }}
        >
          Statewide telemetry reconciliation, mountain corridor load monitoring, and Van Panchayat partner audits across Uttarakhand divisions.
        </p>
      </div>

      <AdminDashboard />
    </div>
  );
}
