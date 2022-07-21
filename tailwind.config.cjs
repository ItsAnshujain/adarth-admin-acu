/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: { 450: '#4B0DAF' },
        orange: { 450: 'rgb(194 65 12)' },
        gray: { 450: 'rgb(229 231 235)' },
      },
    },
  },
  plugins: [],
};
