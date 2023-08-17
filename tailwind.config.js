/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--roboto)'],
        lora: ['var(--lora)']
      },
      colors: {
        purple: '#492A3D',
        'turquoise-300': '#29e3eb',
        'turquoise-400': '#11B4BB',
        'turquoise-800': '#043D40',
        gray: '#D9D9D9',
        'gray-100': '#8A8A8A',
      },
      screens: {
        '3xl': '1920px'
      },
      fontSize: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'footer-large': "url('/footerBgLarge.svg')",
        'footer-mobile': "url('/footerBgMobile.svg')",
      }
    }
  },
  plugins: []
};
