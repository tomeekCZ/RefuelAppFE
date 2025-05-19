/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: '#00ffff',
        neonPink: '#ff00ff',
        neonGreen: '#39ff14',
      },
      boxShadow: {
        neon: '0 0 8px #00ffff, 0 0 16px #00ffff',
      }
    },
  },
  plugins: [],
}