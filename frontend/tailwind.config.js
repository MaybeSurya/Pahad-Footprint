/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern Alpine Emerald Palette
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          DEFAULT: '#15803D',
        },
        // Modern high-contrast Slate Neutrals
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        // Himalayan Terracotta & Clay Accents
        terracotta: {
          DEFAULT: '#EA580C',
          hover: '#C2410C',
          light: '#FFF7ED',
          border: '#FED7AA',
        },
        // Glacier Blue & High-Altitude Accents
        glacier: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          border: '#BFDBFE',
        },
        // Legacy tokens preserved for compatibility
        forest: {
          DEFAULT: '#15803D',
          hover: '#166534',
          light: '#22C55E',
          dark: '#14532D',
        },
        mist: {
          DEFAULT: '#F8FAFC',
          border: '#E2E8F0',
          hover: '#F1F5F9',
          dark: '#CBD5E1',
        },
        alabaster: {
          DEFAULT: '#F8FAFC',
          surface: '#FFFFFF',
          dim: '#F1F5F9',
        },
        charcoal: {
          DEFAULT: '#0F172A',
          light: '#334155',
        },
        slateText: {
          DEFAULT: '#334155',
          muted: '#64748B',
        },
        status: {
          verified: '#15803D',
          verifiedBg: '#DCFCE7',
          pledged: '#B45309',
          pledgedBg: '#FEF3C7',
          calculated: '#334155',
          calculatedBg: '#F1F5F9',
          error: '#DC2626',
          errorBg: '#FEE2E2',
        },
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
        input: '10px',
      },
      gap: {
        grid: '24px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        elevated: '0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        glow: '0 0 25px -5px rgba(22, 163, 74, 0.25)',
      },
    },
  },
  plugins: [],
};
