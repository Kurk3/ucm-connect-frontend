/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,}",
  ],
  theme: {
    extend: {
      keyframes: {
        gradientLoop: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        gradientLoop: 'gradientLoop 5s ease infinite',
      },
      backgroundSize: {
        '200%': '200%',
      },
    },
  },
  plugins: [],
}

