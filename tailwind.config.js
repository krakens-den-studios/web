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
        turquoise: '#11B4BB',
        'dark-turquoise': '#043D40'
      }
    }
  },
  plugins: []
};
