/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0a3254', // A vibrant Deep Blue
          light: '#e2e8f0', // Light gray for backgrounds
        }
      }
    },
  },
  plugins: [],
}
