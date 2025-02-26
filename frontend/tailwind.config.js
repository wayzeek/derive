/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        derive: {
          'bright-red': '#DE354C',
          'deep-red': '#932432',
          'purple': '#3C1874',
          'grey': '#283747',
          'cloud': '#F3F3F3',
        },
      },
    },
  },
  plugins: [],
} 