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
    <header className="sticky top-0 z-50 bg-[#1B4332] text-white shadow-md border-b border-[#2D6A4F]/40" role="banner">
      <div className="max-w-[1440px] mx-auto h-[64px] px-6 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-white/40 rounded-lg p-1"
            aria-label="Pahad Footprint - Home"
          >
            <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center text-white" aria-hidden="true">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L4 15h4v5h8v-5h4L12 2zm0 4.2L15.3 12H13v5h-2v-5H8.7L12 6.2z" />
              </svg>
            </div>
            <span className="text-[17px] font-bold tracking-tight text-white">Pahad Footprint</span>
          </Link>
          <span className="hidden sm:inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-white/90 border border-white/20">
            Sample Demo Data
          </span>
        </div>

        {/* Public Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              pathname === '/'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            Calculator
          </Link>
          <Link
            href="/methodology"
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              pathname === '/methodology'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            Methodology &amp; Sources
          </Link>
          <Link
            href="/restoration"
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              pathname === '/restoration'
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
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
            className="px-2.5 py-1 text-[12px] font-medium rounded-btn border border-white/25 bg-transparent hover:bg-white/10 text-white transition-colors"
            aria-label="Toggle language between English and Hindi"
          >
            {language} | {language === 'EN' ? 'HI' : 'EN'}
          </button>

          {/* Prototype View-Switcher */}
          <div
            className="flex items-center bg-[#0E2319]/70 border border-white/20 rounded-full p-0.5"
            role="group"
            aria-label="Prototype View Switcher"
          >
            <button
              onClick={() => router.push('/')}
              className={`px-3 py-1 text-[12px] font-semibold rounded-full transition-all ${
                !isAdminRoute
                  ? 'bg-white text-[#1B4332] shadow-sm'
                  : 'text-white/75 hover:text-white'
              }`}
              aria-pressed={!isAdminRoute}
            >
              User App
            </button>
            <button
              onClick={() => router.push('/admin')}
              className={`px-3 py-1 text-[12px] font-semibold rounded-full transition-all ${
                isAdminRoute
                  ? 'bg-[#FEF3C7] text-[#92400E] shadow-sm'
                  : 'text-white/75 hover:text-white'
              }`}
              aria-pressed={isAdminRoute}
            >
              Admin View
            </button>
          </div>

          {/* User Account / Session */}
          {session ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-[12px] text-white/90 font-medium">
                {session.role === 'admin' ? '🛡️ Auditor' : '🌲 Tourist'}
              </span>
              <button
                onClick={handleLogout}
                className="text-[12px] font-medium text-white/80 hover:text-white underline p-1"
                title="Log out"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1 text-[12px] font-semibold bg-white/15 hover:bg-white/25 border border-white/25 rounded-btn text-white transition-all"
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-btn bg-white/10 hover:bg-white/20 text-white"
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
        <div className="lg:hidden bg-[#143225] px-6 py-4 border-t border-white/10 flex flex-col gap-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[14px] text-white font-medium hover:text-[#C1ECD4]"
          >
            Calculator
          </Link>
          <Link
            href="/methodology"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[14px] text-white font-medium hover:text-[#C1ECD4]"
          >
            Methodology &amp; Sources
          </Link>
          <Link
            href="/restoration"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[14px] text-white font-medium hover:text-[#C1ECD4]"
          >
            Restoration Initiatives
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[14px] text-[#FEF3C7] font-semibold"
          >
            Admin Analytics Portal
          </Link>
        </div>
      )}
    </header>
  );
};
