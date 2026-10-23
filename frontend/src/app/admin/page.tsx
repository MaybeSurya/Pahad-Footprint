import React from 'react';
import { AdminDashboard } from '../../components/AdminDashboard';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <h1
          className="text-[26px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-tight"
          style={{ color: 'var(--ink)' }}
        >
          Tree Planting &amp; Travel Activity Dashboard
        </h1>
        <p
          className="text-[13.5px] mt-1 max-w-2xl leading-relaxed"
          style={{ color: 'var(--ink-soft)' }}
        >
          Keep track of traveler tree pledges, NGO donations, issued certificates, and village forest progress across Uttarakhand.
        </p>
      </div>

      <AdminDashboard />
    </div>
  );
}
