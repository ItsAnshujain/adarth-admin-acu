/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        dmSans: ['DM Sans'],
      },
      colors: {
        purple: { 450: '#4B0DAF', 350: '#914EFB', 50: '#F4EDFE' },
        darkPurple: { 450: '#390D7F' },
        orange: { 450: '#C2410C', 350: '#FF900E', 50: '#FFF3E6' },
        gray: { 450: '#E5E7EB', 550: '#969EA1', 50: '#EEEEEE' },
        green: { 350: '#4BC0C0', 50: '#EDF8F8' },
        red: { 450: '#FA5252', 350: '#E61B23' },
        blue: { 350: '#2938F7', 50: '#E9EBFE' },
      },
      screens: {
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
};
