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
        purple: { 450: '#4B0DAF', 350: '#914EFB' },
        darkPurple: { 450: '#390D7F' },
        orange: { 450: '#C2410C', 350: '#FF900E' },
        gray: { 450: '#E5E7EB', 550: '#969EA1' },
        red: {
          450: '#FA5252',
        },
      },
      screens: {
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
};
