'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredSession, loginUser } from '../../lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [autoLoggingIn, setAutoLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const session = getStoredSession();
    if (session && session.role === 'admin') {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  };

  const handleInstantAuditorLogin = async () => {
    setAutoLoggingIn(true);
    try {
      await loginUser('admin@pahadfootprint.gov.in', 'PahadAdmin2026!');
      setAuthorized(true);
    } catch (err) {
      console.error('Instant auditor login error:', err);
    } finally {
      setAutoLoggingIn(false);
    }
  };

  if (authorized === null) {
    return (
      <div className="py-20 text-center text-[#4B5563]">
        <div className="w-8 h-8 border-3 border-[#1B4332] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[13px] font-medium">Verifying Regional Auditor RBAC Credentials...</p>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white border border-[#D8E8DF] rounded-card shadow-card text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#92400E] flex items-center justify-center mx-auto text-[22px]">
          🛡️
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-[#111827]">Regional Auditor Access Protected</h2>
          <p className="text-[13px] text-[#4B5563] mt-1 leading-relaxed">
            The Uttarakhand Tourism Carbon Analytics Portal requires administrative credentials (Role: <code>admin</code>).
          </p>
        </div>

        <div className="p-3 bg-[#EDF6F0] rounded-btn border border-[#D8E8DF] text-[12px] text-[#1B4332] font-medium">
          Quick Demo Credentials: <code>admin@pahadfootprint.gov.in</code>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleInstantAuditorLogin}
            disabled={autoLoggingIn}
            className="w-full py-2.5 bg-[#1B4332] hover:bg-[#143225] text-white font-semibold text-[13px] rounded-btn shadow transition-colors"
          >
            {autoLoggingIn ? 'Authenticating Auditor Session...' : 'Instant Auditor Login (Demo)'}
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-2.5 bg-[#F8FAF9] hover:bg-[#EDF6F0] text-[#4B5563] font-semibold text-[13px] rounded-btn border border-[#D8E8DF] transition-colors"
          >
            Return to Public Calculator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sticky Admin Sub-Ribbon */}
      <div className="bg-[#113D2C] text-white py-2 px-6 rounded-card shadow-sm flex items-center justify-between flex-wrap gap-2 text-[12px]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-bold">Admin Portal Active: Regional Auditor</span>
          <span className="text-white/70">| State Tourism Carbon Reconciled Ledger</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-white/15 text-[11px] font-mono">Role: admin</span>
        </div>
      </div>

      {children}
    </div>
  );
}
