import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { SmoothScrollProvider } from '../components/SmoothScrollProvider';

export const metadata: Metadata = {
  title: 'Pahad Footprint — Uttarakhand Carbon Accounting & Analytics',
  description:
    'Calculate, compare, and restore carbon footprints from mountain travel across sensitive Himalayan ecosystems in Uttarakhand.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans antialiased selection:bg-brand-100 selection:text-brand-900">
        <SmoothScrollProvider>
          {/* Skip to Content for Accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 z-[100] px-4 py-2 bg-white text-emerald-800 font-bold border-2 border-emerald-600 rounded-btn shadow-elevated"
          >
            Skip to main content
          </a>

          <Navbar />

          <main id="main-content" className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
        </SmoothScrollProvider>

        {/* Modern Clean Global Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
          <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between flex-wrap gap-4 text-[12.5px] text-slate-500">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L4 15h4v5h8v-5h4L12 2z" />
                </svg>
              </div>
              <span className="font-semibold text-slate-800">
                Pahad Footprint • Uttarakhand Eco-Carbon Accounting System
              </span>
            </div>
            <p className="text-slate-500">© 2026 Pahad Footprint. Grounded in Himalayan ecological data protocols (Model v1.2-2026).</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
