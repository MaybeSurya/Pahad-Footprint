'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserSession } from '../types';
import { getStoredSession, clearSession } from '../lib/api';

interface NavbarProps {
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  useEffect(() => {
    setSession(getStoredSession());
    const handleStorageChange = () => setSession(getStoredSession());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isAdminRoute = pathname?.startsWith('/admin');

  const handleLogout = () => {
    clearSession();
    setSession(null);
    if (isAdminRoute) {
      router.push('/');
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'HI' : 'EN'));
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md text-slate-800 shadow-card border-b border-slate-200/80 transition-colors" role="banner">
      <div className="max-w-[1440px] mx-auto h-[68px] px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-xl p-1"
            aria-label="Pahad Footprint - Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 border border-emerald-500/30 flex items-center justify-center text-white shadow-sm" aria-hidden="true">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L4 15h4v5h8v-5h4L12 2zm0 4.2L15.3 12H13v5h-2v-5H8.7L12 6.2z" />
              </svg>
            </div>
            <div>
              <span className="text-[17px] font-bold tracking-tight text-slate-900 block leading-tight">Pahad Footprint</span>
              <span className="text-[10.5px] font-medium text-slate-500 hidden sm:block">Uttarakhand Carbon Registry</span>
            </div>
          </Link>
          <span className="hidden md:inline-flex items-center text-[10.5px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            ARAI Baseline
          </span>
        </div>

        {/* Public Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main navigation">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-xl text-[13.5px] font-medium transition-all ${
              pathname === '/'
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs border border-emerald-200/60'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Calculator
          </Link>
          <Link
            href="/methodology"
            className={`px-3.5 py-1.5 rounded-xl text-[13.5px] font-medium transition-all ${
              pathname === '/methodology'
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs border border-emerald-200/60'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Methodology &amp; Sources
          </Link>
          <Link
            href="/restoration"
            className={`px-3.5 py-1.5 rounded-xl text-[13.5px] font-medium transition-all ${
              pathname === '/restoration'
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs border border-emerald-200/60'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Restoration Initiatives
          </Link>
        </nav>

        {/* Right Actions & Prototype View Switcher */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 text-[12px] font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
            aria-label="Toggle language between English and Hindi"
          >
            {language} | {language === 'EN' ? 'HI' : 'EN'}
          </button>

          {/* Prototype View-Switcher */}
          <div
            className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-0.5"
            role="group"
            aria-label="Prototype View Switcher"
          >
            <button
              onClick={() => router.push('/')}
              className={`px-3 py-1 text-[12px] font-semibold rounded-full transition-all ${
                !isAdminRoute
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={!isAdminRoute}
            >
              User App
            </button>
            <button
              onClick={() => router.push('/admin')}
              className={`px-3 py-1 text-[12px] font-semibold rounded-full transition-all ${
                isAdminRoute
                  ? 'bg-amber-100 text-amber-900 shadow-xs font-bold border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={isAdminRoute}
            >
              Admin View
            </button>
          </div>

          {/* User Account / Session */}
          {session ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-[12px] text-slate-700 font-medium">
                {session.role === 'admin' ? '🛡️ Auditor' : '🌲 Tourist'}
              </span>
              <button
                onClick={handleLogout}
                className="text-[12px] font-medium text-slate-500 hover:text-rose-600 underline p-1"
                title="Log out"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-[12.5px] font-semibold bg-emerald-700 hover:bg-emerald-800 border border-emerald-600 rounded-xl text-white shadow-xs transition-all"
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white px-6 py-4 border-t border-slate-200 flex flex-col gap-2 shadow-elevated">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[14px] text-slate-700 font-medium hover:text-emerald-700"
          >
            Calculator
          </Link>
          <Link
            href="/methodology"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[14px] text-slate-700 font-medium hover:text-emerald-700"
          >
            Methodology &amp; Sources
          </Link>
          <Link
            href="/restoration"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[14px] text-slate-700 font-medium hover:text-emerald-700"
          >
            Restoration Initiatives
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[14px] text-amber-800 font-semibold"
          >
            Admin Analytics Portal
          </Link>
        </div>
      )}
    </header>
  );
};
