/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: { 450: '#4B0DAF', 350: '#914EFB' },
        orange: { 450: '#C2410C', 350: '#FF900E' },
        gray: { 450: '#E5E7EB' },
      },
    },
  },
  plugins: [],
};
