/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        primary: {
          DEFAULT: '#007AFF',
          hover: '#0051D5',
          light: '#E5F2FF',
        },
        surface: {
          DEFAULT: '#F5F5F7',
          hover: '#EBEBED',
        },
        border: {
          DEFAULT: '#D1D1D6',
          light: '#E5E5EA',
        },
        text: {
          primary: '#1D1D1F',
          secondary: '#86868B',
          tertiary: '#C7C7CC',
        },
        ai: {
          primary: '#AF52DE',
          background: '#F5EBFF',
          border: '#D7B8F3',
        },
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
        info: '#5AC8FA',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      animation: {
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
