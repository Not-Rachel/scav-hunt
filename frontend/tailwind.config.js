/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx}', // Expo Router pages
    './components/**/*.{js,ts,tsx}', // Shared components
    './index.{js,ts,tsx}', // Entry file
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
