/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#228B22',
        'sage-green': '#87A96B',
        'mint-green': '#98D8C8',
        'coffee-brown': '#8B4513',
        'golden-yellow': '#DAA520',
        'cream': '#F5DEB3',
        'light-cream': '#FAF7F0',
        'warm-gray': '#8B7D6B',
        'dark-brown': '#3E2723'
      }
    },
  },
  plugins: [],
}