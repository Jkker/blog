/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

const gray = {
  // ...colors.zinc,
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  450: '#8B8B8B',
  500: '#737373',
  550: '#5a5759',
  600: '#403e41',
  700: '#2d2a2e',
  800: '#222022',
  850: '#1E1C1E',
  900: '#19181A',
}
const blue = {
  ...colors.blue,
  450: '#4E94F8',
  550: '#3073F1',
}

module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './layouts/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: ['class', '.dark-mode'], // or 'media' or 'class'
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: '.5rem',
        lg: '1rem',
      },
      boxShadow: {
        md: '0px 9px 24px rgb(0 0 0 / 6%)',
      },
      colors: {
        gray,
        blue: blue,
        primary: blue,
      },
      fontFamily: {
        sans: ['Lexend', 'Noto Sans SC', ...defaultTheme.fontFamily.sans],
        mono: ['Jetbrains Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
}
