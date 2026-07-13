/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        accent: '#22D3EE',
        critical: '#EF4444',
        high: '#F59E0B',
      },
    },
  },
  plugins: [],
}
