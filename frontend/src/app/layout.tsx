import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SmoothScrollProvider } from '../components/SmoothScrollProvider';
import { TranslationProvider } from '../contexts/TranslationContext';
import { TripProvider } from '../contexts/TripContext';
import { PWARegister } from '../components/PWARegister';

export const metadata: Metadata = {
  title: 'Pahad Footprint — Greener Uttarakhand Trips & Offline Field Guide',
  description:
    'Estimate the travel and stay footprint of journeys through Uttarakhand, compare lower-impact options, examine high-altitude elevation adjustments, and view destination weather offline.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192' },
      { url: '/icons/icon-512.png', sizes: '512x512' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pahad Footprint',
  },
};

export const viewport = {
  themeColor: '#304B38',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
        <meta name="theme-color" content="#304B38" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col antialiased"
        style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
      >
        <SmoothScrollProvider>
          <TranslationProvider>
            <TripProvider>
              <PWARegister />
              {/* Accessible Skip Link */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 z-[100] px-4 py-2 bg-white text-[#304B38] font-bold border-2 border-[#496951] rounded shadow-elevated"
              >
                Skip to main content
              </a>

              <Navbar />

              <main id="main-content" className="flex-1 w-full max-w-[1380px] 2xl:max-w-[1560px] 3xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 sm:py-10 lg:py-12">
                {children}
              </main>

              <Footer />
            </TripProvider>
          </TranslationProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
