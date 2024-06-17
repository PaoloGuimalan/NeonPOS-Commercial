/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      // use colors only specified
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      black: colors.black,
      red: colors.red,
      orange: colors.orange,
      green: colors.green,
      transparent: colors.transparent,
      primary: '#ffffff',
      secondary: '#e8e8e8',
      tertiary: '#6db33f',
      shade: 'rgba(240, 242, 245, 0.8)',
      header: '#fafafa',
      modal: 'rgba(0,0,0,0.8)',
      accent: {
        primary: '#606970',
        secondary: '#c724b1',
        tertiary: '#12051c',
        hover: '#e87fda'
      },
      text: {
        primary: '#eceaea',
        secondary: '#616161'
      }
    },
    extend: {
      fontFamily: {
        Inter: ['Inter', 'sans-serif']
      }
    }
  },
  variants: {
    extend: {},
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui']
    }
  },
  plugins: []
};
