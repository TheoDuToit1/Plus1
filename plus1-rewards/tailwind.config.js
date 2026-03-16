/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#1a568b',
          600: '#154a7a',
          700: '#0f3d69',
          DEFAULT: '#11d452',
        },
        secondary: {
          50: '#f0fdf4',
          500: '#37d270',
          600: '#2fb85f',
          700: '#27a04e',
        },
        'background-light': '#f6f8f6',
        'background-dark': '#102216',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
