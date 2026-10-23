'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Compass, BookOpen, Trees, BarChart3 } from 'lucide-react';
import { UserSession } from '../types';
import { getStoredSession, clearSession } from '../lib/api';
import { useTranslation } from '../contexts/TranslationContext';

interface NavbarProps {
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
    const handleStorageChange = () => setSession(getStoredSession());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminRoute = pathname?.startsWith('/admin');

  const handleLogout = () => {
    clearSession();
    setSession(null);
    if (isAdminRoute) router.push('/');
  };

  const toggleLanguage = () => setLanguage(language === 'EN' ? 'HI' : 'EN');

  

  const navLinkClass = (active: boolean) =>
    `px-3.5 py-1.5 rounded text-[13px] font-medium transition-all duration-180 ${
      active
        ? 'bg-[#E8EDE5] text-[#304B38] font-semibold'
        : 'text-[#51554D] hover:text-[#242722] hover:bg-[#F0EEE6]'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-[#F7F6F0]/95 backdrop-blur-md shadow-[0_2px_10px_rgba(36,39,34,0.06)]'
          : 'bg-[#F7F6F0]/90 backdrop-blur-sm'
      }`}
      style={{ borderColor: 'var(--line)' }}
      role="banner"
    >
      <div className="max-w-[1380px] 2xl:max-w-[1560px] 3xl:max-w-[1720px] mx-auto h-[68px] px-4 sm:px-6 lg:px-8 2xl:px-12 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[#496951] rounded p-1"
            aria-label="Pahad Footprint - Home"
          >
            {/* Pen-and-ink etched mountain mark */}
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded border flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{
                backgroundColor: 'var(--paper-card)',
                borderColor: 'var(--line)',
                color: 'var(--green-deep)',
              }}
              aria-hidden="true"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 42 42" fill="none">
                <path d="M4 31 15.2 14l6.1 8.5 4.1-6.1L38 31H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="m15.2 14 3.1 4.4-3.9-1.2M25.4 16.4l2.3 3.3-3.4-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M8 35h26" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="text-[15px] sm:text-[16px] font-bold tracking-tight text-[#242722] block leading-tight">
                {t('home.title')}
              </span>
              <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider text-[#777C72] hidden sm:block">
                {t('home.subtitle')}
              </span>
            </div>
          </Link>
          <span className="hidden xl:inline-flex items-center text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
            {t('home.elevationAware')}
          </span>
        </div>

// Desktop Navigation Links
        <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main navigation">
          <Link href="/" className={`${navLinkClass(pathname === '/')} flex items-center gap-1.5`}>
            <Home className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'होम' : 'Home'}</span>
          </Link>
          <Link href="/calculator/route" className={`${navLinkClass(pathname?.startsWith('/calculator'))} flex items-center gap-1.5`}>
            <Compass className="w-3.5 h-3.5" />
            <span>{t('navigation.calculator')}</span>
          </Link>
          <Link href="/methodology" className={`${navLinkClass(pathname === '/methodology')} flex items-center gap-1.5`}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('navigation.methodology')}</span>
          </Link>
          <Link href="/restoration" className={`${navLinkClass(pathname === '/restoration')} flex items-center gap-1.5`}>
            <Trees className="w-3.5 h-3.5" />
            <span>{t('navigation.restoration')}</span>
          </Link>
        </nav>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher (EN | हिन्दी) */}
          <div
            className="flex items-center bg-[#F0EEE6] border border-[#2D322B29] rounded-md p-0.5"
            role="group"
            aria-label="Language Selector"
          >
            <button
              type="button"
              onClick={() => setLanguage('EN')}
              className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded transition-all ${
                language === 'EN'
                  ? 'bg-white text-[#304B38] shadow-xs'
                  : 'text-[#777C72] hover:text-[#242722]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('HI')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded transition-all ${
                language === 'HI'
                  ? 'bg-white text-[#304B38] shadow-xs font-semibold'
                  : 'text-[#777C72] hover:text-[#242722]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* View Switcher: User App vs Admin View (visible on sm+) */}
          <div
            className="hidden sm:flex items-center bg-[#F0EEE6] border border-[#2D322B29] rounded-md p-0.5"
            role="group"
            aria-label="Application View Switcher"
          >
            <button
              onClick={() => router.push('/')}
              className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-[11.5px] font-medium rounded transition-all ${
                !isAdminRoute
                  ? 'bg-white text-[#242722] shadow-xs font-semibold'
                  : 'text-[#777C72] hover:text-[#242722]'
              }`}
              aria-pressed={!isAdminRoute}
            >
              {t('navigation.userApp')}
            </button>
            <button
              onClick={() => router.push('/admin')}
              className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-[11.5px] font-medium rounded transition-all ${
                isAdminRoute
                  ? 'bg-[#242722] text-white shadow-xs font-semibold'
                  : 'text-[#777C72] hover:text-[#242722]'
              }`}
              aria-pressed={isAdminRoute}
            >
              {t('navigation.adminView')}
            </button>
          </div>

          {/* Auth State */}
          {session ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden md:inline-block text-[11.5px] font-mono text-[#51554D]">
                {session.role === 'admin' ? `🛡 ${t('navigation.auditor')}` : `👤 ${t('navigation.traveler')}`}
              </span>
              <button
                onClick={handleLogout}
                className="text-[11px] sm:text-[11.5px] font-medium text-[#777C72] hover:text-[#242722] underline p-1 transition-colors"
                title="Log out"
              >
                {t('navigation.logout')}
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="button-primary text-[11px] sm:text-[11.5px] py-1 sm:py-1.5 px-2.5 sm:px-3 rounded"
            >
              {t('navigation.signIn')}
            </button>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded border border-[#2D322B29] bg-[#FFFFFF] hover:bg-[#F0EEE6] text-[#242722] transition-colors"
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden px-4 sm:px-6 py-4 border-t flex flex-col gap-2 shadow-md animate-fadeIn"
          style={{ backgroundColor: 'var(--paper)', borderColor: 'var(--line)' }}
        >
          {/* Mobile View Switcher */}
          <div className="flex sm:hidden items-center bg-[#F0EEE6] border border-[#2D322B29] rounded-md p-1 mb-2">
            <button
              onClick={() => {
                router.push('/');
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-1.5 text-[12px] font-medium rounded transition-all text-center ${
                !isAdminRoute
                  ? 'bg-white text-[#242722] shadow-xs font-semibold'
                  : 'text-[#777C72]'
              }`}
            >
              {t('navigation.userApp')}
            </button>
            <button
              onClick={() => {
                router.push('/admin');
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-1.5 text-[12px] font-medium rounded transition-all text-center ${
                isAdminRoute
                  ? 'bg-[#242722] text-white shadow-xs font-semibold'
                  : 'text-[#777C72]'
              }`}
            >
              {t('navigation.adminView')}
            </button>
          </div>

          {[
            { href: '/', label: language === 'HI' ? 'होम' : 'Home', icon: Home, active: pathname === '/' },
            { href: '/calculator/route', label: t('navigation.calculator'), icon: Compass, active: pathname?.startsWith('/calculator') },
            { href: '/methodology', label: t('navigation.methodology'), icon: BookOpen, active: pathname === '/methodology' },
            { href: '/restoration', label: t('navigation.restoration'), icon: Trees, active: pathname === '/restoration' },
            { href: '/admin', label: t('navigation.adminAnalytics'), icon: BarChart3, active: pathname === '/admin' },
          ].map(({ href, label, icon: Icon, active }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 px-3 rounded text-[14px] font-medium transition-colors flex items-center gap-2.5 ${
                active
                  ? 'bg-[#E8EDE5] text-[#304B38] font-semibold'
                  : 'text-[#51554D] hover:bg-[#F0EEE6]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#496951]" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
