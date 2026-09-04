import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc', // Clean off-white slate-50 background
        surface: '#ffffff',
        neutralText: '#1e293b', // High-contrast slate-800 soft charcoal
        subtleText: '#475569', // Slate-600 readable secondary
        borderSubtle: '#cbd5e1', // Slate-300 accessible border
        accentGreen: {
          light: '#ecfdf5', // Muted subtle green background
          DEFAULT: '#047857', // Muted deep forest green (accessible contrast 7:1)
          dark: '#065f46',
          border: '#a7f3d0'
        },
        slatePrimary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontSize: {
        'rural-base': ['1.125rem', { lineHeight: '1.75rem' }], // 18px base for rural readability
        'rural-lg': ['1.25rem', { lineHeight: '1.875rem' }],
        'rural-xl': ['1.5rem', { lineHeight: '2rem' }],
        'rural-2xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'rural-3xl': ['2.25rem', { lineHeight: '2.75rem' }]
      }
    },
  },
  plugins: [],
};

export default config;
