/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'deep-blue': '#0A192F',
        'neon-cyan': '#00F5FF',
        'cyber-gray': '#8892B0',
        'light-slate': '#A8B2D1',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'flow': 'flow 12s ease-in-out infinite',
        'flowRev': 'flowRev 18s ease-in-out infinite',
        'flow-slow': 'flowSlow 25s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        flow: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(-50px,-30px,0) scale(1.05)' },
          '100%': { transform: 'translate3d(0,0,0) scale(1)' },
        },
        flowRev: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(40px,20px,0) scale(1.03)' },
          '100%': { transform: 'translate3d(0,0,0) scale(1)' },
        },
        flowSlow: {
          '0%': { transform: 'translate3d(0,0,0) scale(1.1)' },
          '50%': { transform: 'translate3d(20px,-40px,0) scale(1.15)' },
          '100%': { transform: 'translate3d(0,0,0) scale(1.1)' },
        },
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};