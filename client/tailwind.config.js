/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        glass: {
          light: 'rgba(255, 255, 255, 0.65)',
          'light-solid': 'rgba(255, 255, 255, 0.85)',
          dark: 'rgba(18, 22, 34, 0.65)',
          'dark-solid': 'rgba(18, 22, 34, 0.85)',
          border: 'rgba(255, 255, 255, 0.25)',
          'border-dark': 'rgba(255, 255, 255, 0.08)',
        },
        apple: {
          blue: '#0071e3',
          purple: '#af52de',
          pink: '#ff2d55',
          indigo: '#5856d6',
          teal: '#30b0c7',
          mint: '#00c7be',
          amber: '#ff9500',
          red: '#ff3b30',
          green: '#34c759',
          gray: '#8e8e93',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.05)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.12)',
        'glass-glow': '0 0 40px -10px rgba(0, 113, 227, 0.3)',
        'glass-glow-purple': '0 0 40px -10px rgba(175, 82, 222, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        'glass-heavy': '28px',
      },
      animation: {
        'liquid-pulse': 'liquidPulse 8s ease-in-out infinite',
        'subtle-float': 'subtleFloat 6s ease-in-out infinite',
      },
      keyframes: {
        liquidPulse: {
          '0%, 100%': { transform: 'scale(1) translate(0, 0)', opacity: '0.4' },
          '50%': { transform: 'scale(1.15) translate(20px, -15px)', opacity: '0.7' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
