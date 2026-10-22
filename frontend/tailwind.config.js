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
        forest: {
          DEFAULT: '#1B4332',
          hover: '#143225',
          light: '#2D6A4F',
          dark: '#0F261C',
        },
        mist: {
          DEFAULT: '#EDF6F0',
          border: '#D8E8DF',
          hover: '#E2F0E7',
          dark: '#D0E5D8',
        },
        alabaster: {
          DEFAULT: '#F8FAF9',
          surface: '#FFFFFF',
          dim: '#F0F4F2',
        },
        charcoal: {
          DEFAULT: '#111827',
          light: '#1F2937',
        },
        slateText: {
          DEFAULT: '#4B5563',
          muted: '#6B7280',
        },
        terracotta: {
          DEFAULT: '#C85A32',
          hover: '#B54D27',
          light: '#FDEEE8',
        },
        status: {
          verified: '#1B4332',
          verifiedBg: '#C1ECD4',
          pledged: '#92400E',
          pledgedBg: '#FEF3C7',
          calculated: '#374151',
          calculatedBg: '#F3F4F6',
          error: '#BA1A1A',
          errorBg: '#FFDAD6',
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
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(27,67,50,0.06), 0 1px 3px -1px rgba(27,67,50,0.03)',
        elevated: '0 12px 24px -4px rgba(27,67,50,0.10), 0 4px 8px -2px rgba(27,67,50,0.04)',
      },
    },
  },
  plugins: [],
};
