/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#107163',
        'primary-dark': '#0a5550',
        navy: '#1E3A8A',
        text: '#222222',
        muted: '#888888',
        surface: '#FAFAFA',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
        document: ['Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
