/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'naver-green': '#03C75A',
        'naver-dark': '#1E3A8A',
      },
    },
  },
  plugins: [],
}
