/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070A13', // main body background
          900: '#0D1322', // primary cards & panels
          850: '#11182B', // secondary cards
          800: '#162038', // borders & hover surfaces
          700: '#1E2B4A', // active borders & subtle inputs
          600: '#2A3B63',
        },
        cyber: {
          blue: '#3B82F6',
          indigo: '#6366F1',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          glow: 'rgba(59, 130, 246, 0.15)',
        },
        risk: {
          low: '#10B981',      // Green
          medium: '#F59E0B',   // Yellow
          high: '#F97316',     // Orange
          critical: '#EF4444', // Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.7)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
