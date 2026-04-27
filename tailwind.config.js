/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0B0B',
        champagne: '#F2E7D8',
        gold: '#C7A66A',
        graphite: '#171717',
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['Inter', '"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 24px 80px rgba(0, 0, 0, 0.35)',
        glass: '0 8px 30px rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        grain:
          'radial-gradient(circle at 20% 20%, rgba(199,166,106,0.16), transparent 50%), radial-gradient(circle at 80% 0%, rgba(242,231,216,0.12), transparent 45%)',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
