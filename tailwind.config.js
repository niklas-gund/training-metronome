/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ming: {
          50: "#f1f9fa",
          100: "#dceff1",
          200: "#bedfe3",
          300: "#91c8cf",
          400: "#5ca8b4",
          500: "#418c99",
          600: "#3c7a89",
          700: "#335f6b",
          800: "#30505a",
          900: "#2c444d",
          950: "#192c33",
        },
      },
    },
  },
  plugins: [],
};
