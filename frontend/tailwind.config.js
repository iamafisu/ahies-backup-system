/** @type {import('tailwindcss').Config} */

// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Tells Tailwind where to look for classes in your React components
    './public/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


