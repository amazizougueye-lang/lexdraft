/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#091413',
        foreground: '#F0F4F2',
        primary: {
          DEFAULT: '#285A48',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#0f1f1d',
          foreground: '#F0F4F2',
        },
        border: '#1e3b32',
        muted: {
          DEFAULT: '#122420',
          foreground: '#8aada4',
        },
        accent: {
          DEFAULT: '#285A48',
          foreground: '#FFFFFF',
        },
        // Legacy aliases
        'primary-dark': '#1e4235',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        document: ['Times New Roman', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
    },
  },
  plugins: [],
}
