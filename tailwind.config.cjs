/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: { 450: '#4B0DAF' },
        orange: { 450: '#C2410C' },
        gray: { 450: '#E5E7EB' },
      },
    },
  },
  plugins: [],
};
