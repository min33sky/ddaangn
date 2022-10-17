const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['pretendard', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        tahiti: {
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',

          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        brown: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
      },
      screens: {
        xs: '500px', // 윈도우에서 브라우저 너비를 최대로 줄인 사이즈가 500px이므로 500px 이상부터 모바일 뷰 해제
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
