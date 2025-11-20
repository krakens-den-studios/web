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
        turquoise: {
          300: '#29e3eb',
          400: '#11B4BB',
          800: '#043D40'
        },
        gray: {
          DEFAULT: '#D9D9D9',
          100: '#8A8A8A',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      screens: {
        '3xl': '1920px'
      },
      fontSize: {
        '3xl': '1.5rem',
        '4xl': '2rem'
      },
      backgroundImage: {
        'heartweaver-cover': "url('/heartweaverCover.png')",
        'heartweaver-cover-mobile': "url('/heartweaverCoverMobile.png')",
        'footer-large': "url('/footerBgLarge.svg')",
        'footer-mobile': "url('/footerBgMobile.svg')"
      },
      gridTemplateAreas: {
        left: ['image story'],
        right: ['story image']
      },
      gridTemplateColumns: {
        left: 'minmax(0, 0.66fr) minmax(0, 1fr)',
        right: 'minmax(0, 1fr) minmax(0, 0.66fr)'
      }
    }
  },
  plugins: [require('@savvywombat/tailwindcss-grid-areas')]
};
