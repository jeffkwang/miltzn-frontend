/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    fontFamily: {
      heading: ['Cormorant Garamond', 'sans-serif'],
      display: ['Noto Sans Display', 'sans-serif'],
      display_bold: ['Noto Sans Display', 'sans-serif'],
      paragraph: ['Nunito Sans', 'sans-serif'],
    },
    extend: {
      transitionProperty: {
      'right': 'right',
      'spacing': 'margin, padding',
      },
      zIndex: {
        '100': '100',
        '200': '200',
        '102': '102',
      },
      colors: {
        transparent: 'transparent',
        beige: '#fffaf2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

