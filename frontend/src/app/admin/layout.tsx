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
      <div className="py-20 text-center text-[#777C72]">
        <div className="w-7 h-7 border-2 border-[#496951] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[12.5px] font-mono">Verifying Regional Auditor RBAC Credentials...</p>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 journal-card text-center space-y-4">
        <div className="w-11 h-11 rounded border flex items-center justify-center mx-auto text-[20px] bg-[#F1EADD] border-[#B3834D]/30 text-[#8A5D2E]">
          🛡️
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-[#242722]">Regional Auditor Access Protected</h2>
          <p className="text-[12.5px] text-[#51554D] mt-1 leading-relaxed">
            The Uttarakhand Tourism Carbon Analytics Portal requires administrative credentials (Role: <code className="font-mono text-[#304B38]">admin</code>).
          </p>
        </div>

        <div className="p-3 bg-[#FAF9F5] rounded border border-[#2D322B29] text-[11.5px] text-[#304B38] font-mono">
          Demo Auditor: <code>admin@pahadfootprint.gov.in</code>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleInstantAuditorLogin}
            disabled={autoLoggingIn}
            className="w-full py-2.5 button-primary text-[12.5px]"
          >
            {autoLoggingIn ? 'Authenticating Auditor Session...' : 'Instant Auditor Login (Demo)'}
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-2.5 btn-outline text-[12.5px]"
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
      <div
        className="text-white py-2.5 px-5 rounded flex items-center justify-between flex-wrap gap-2 text-[12px] border"
        style={{
          backgroundColor: 'var(--ink)',
          borderColor: 'var(--ink)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#E8EDE5] animate-pulse" />
          <span className="font-bold">Admin Portal Active: Regional Auditor</span>
          <span className="text-[#CFCABF] font-mono text-[11px] hidden sm:inline">
            | State Tourism Carbon Reconciled Ledger
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-white/10 text-[10.5px] font-mono">
            Role: admin
          </span>
        </div>
      </div>

      {children}
    </div>
  );
}
