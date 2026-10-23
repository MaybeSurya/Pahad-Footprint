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
        // Himalayan Field Guide & Paper Palette
        paper: {
          DEFAULT: '#F7F6F0',
          deep: '#F0EEE6',
          card: '#FFFFFF',
          subtle: '#FAF9F5',
        },
        ink: {
          DEFAULT: '#242722',
          soft: '#51554D',
          faint: '#777C72',
          muted: '#8C9186',
        },
        line: {
          DEFAULT: 'rgba(45, 50, 43, 0.16)',
          strong: 'rgba(45, 50, 43, 0.28)',
          subtle: 'rgba(45, 50, 43, 0.08)',
        },
        // Deep Alpine / Forest Green
        green: {
          DEFAULT: '#496951',
          deep: '#304B38',
          pale: '#E8EDE5',
          light: '#F0F4EE',
        },
        // Muted Warm Amber for caveats/warnings
        amber: {
          DEFAULT: '#B3834D',
          pale: '#F1EADD',
          deep: '#8A5D2E',
        },
        // Base / Surface mappings for component compatibility
        base: '#F7F6F0',
        surface: {
          DEFAULT: '#F0EEE6',
          raised: '#FFFFFF',
        },
        border: {
          DEFAULT: 'rgba(45, 50, 43, 0.16)',
          strong: 'rgba(45, 50, 43, 0.28)',
        },
        accent: {
          DEFAULT: '#496951',
          hover: '#304B38',
          light: '#E8EDE5',
          text: '#304B38',
          border: 'rgba(73, 105, 81, 0.3)',
        },
        // Legacy slate mappings
        slate: {
          50: '#F9F8F5',
          100: '#F0EEE6',
          200: '#E4E1D8',
          300: '#CFCABF',
          400: '#9E9A90',
          500: '#777C72',
          600: '#51554D',
          700: '#3D423A',
          800: '#2E322B',
          900: '#242722',
          950: '#181A16',
        },
      },

      borderRadius: {
        card: '12px',
        btn: '6px',
        input: '6px',
      },

      gap: {
        grid: '20px',
      },

      fontFamily: {
        sans: ['"DM Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'SFMono-Regular', 'Consolas', 'monospace'],
        devanagari: ['"Noto Sans Devanagari"', '"Nirmala UI"', 'sans-serif'],
      },

      boxShadow: {
        card: '0 1px 3px rgba(36, 39, 34, 0.05)',
        elevated: '0 8px 24px rgba(36, 39, 34, 0.08)',
        subtle: '0 2px 8px rgba(36, 39, 34, 0.04)',
        paper: '0 1px 2px rgba(36, 39, 34, 0.06), 0 0 0 1px rgba(45, 50, 43, 0.12)',
      },

      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },

      animation: {
        'fade-up': 'fade-up 0.4s ease forwards',
        'pulse-dot': 'pulse-dot 2s ease infinite',
      },
    },
  },
  plugins: [],
};
