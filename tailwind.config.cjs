const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // corePlugins: {
  //   container: false
  // },
  theme: {
    extend: {
      colors: {
        orange: '#ee4d2d'
      },
      backgroundImage: {
        'footer-gradient': 'linear-gradient(to right, #ffffff, #f9f9f9, #edf3f8)'
      }
    }
  },
  plugins: []
}
