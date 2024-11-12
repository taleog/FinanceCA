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
        chatbg: {
          DEFAULT: '#212121',
          dark: '#171717',
        },
        chattext: {
          DEFAULT: '#ECECF1',
          muted: '#8E8EA0',
        },
        chataccent: {
          DEFAULT: '#10A37F',
          hover: '#0E906F',
        }
      }
    },
  },
  plugins: [],
}
