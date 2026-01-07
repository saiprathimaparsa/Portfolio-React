/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        pacifico: ['Pacifico', 'cursive'],
      },
      colors: {
        primary: colors.indigo,
        secondary: 'var(--secondary-color)',
      },
    },
  },
  plugins: [],
} 