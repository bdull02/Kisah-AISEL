/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        charcoal: '#2C2A29',
        rose: '#F4A298',
        matcha: '#A3B899',
        butter: '#F9E2AF',
        clay: '#E2C2B3',
        lavender: '#D8C3E8',
        terracotta: '#D96B5F',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        handwriting: ['Caveat', 'cursive'],
        body: ['Quicksand', 'sans-serif'],
      },
      boxShadow: {
        'tactile': '4px 4px 0px #2C2A29',
        'tactile-sm': '2px 2px 0px #2C2A29',
        'tactile-lg': '6px 6px 0px #2C2A29',
        'tactile-xl': '8px 8px 0px #2C2A29',
      }
    },
  },
  plugins: [],
}
