/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

const gray = {
  ...colors.neutral,
  // 300: '#c1c0c0',
  // 400: '#939293',
  // 500: '#727072',
  600: '#403e41',
  700: '#2d2a2e',
  800: '#222022',
  850: '#1E1C1E',
  900: '#19181A'
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
        day: {
          DEFAULT: gray['50'],
        },
        night: {
          DEFAULT: gray['900'],
        },
        hexo: {
          background: gray['50'],
          'background-dark': gray['900'],
          'black-gray': gray['800'],
          'light-gray': gray['10'],
        },
        primary: colors.blue,
      },
      fontFamily: {
        sans: ['Lexend', 'Noto Sans SC', ...defaultTheme.fontFamily.sans],
        mono: ['Jetbrains Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
}
