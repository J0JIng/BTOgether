/** @type {import('tailwindcss').Config} */
module.exports = {

  corePlugins: {
    preflight: false,
  },
 
  content: [
    './src/pages/DashboardPage.js',
    './src/components/Button.js',
    './src/components/Container.js',
    './src/components/Input.js',
    './src/components/Item.js',
    './src/components/Modal.js'
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          '50': '#fffafa',
          '100': '#fef4f8',
          '200': '#fee0e8',
          '300': '#fcb1bd',
          '400': '#f6688e',
          '500': '#e91e63', // Add pink-500 color definition here
          '600': '#d61d5f',
          '700': '#b81b52',
          '800': '#9b1944',
          '900': '#79163a'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
