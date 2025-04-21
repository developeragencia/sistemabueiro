/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a365d',
          dark: '#153e75',
        },
        secondary: {
          DEFAULT: '#4a5568',
          dark: '#2d3748',
        },
      },
    },
  },
  plugins: [],
} 