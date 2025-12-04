/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        'bg-dark': '#050505',
        'bg-card': '#0a0a0a',
        'accent': '#00ff88',
        'accent-secondary': '#00d4ff',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'blob': 'blob 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
