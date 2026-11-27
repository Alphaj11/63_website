/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coal: '#111111',
        night: '#080808',
        ember: { DEFAULT: '#FF6A00', light: '#FF8A24', deep: '#C94F00' },
        cream: '#F5F0E8',
        ash: '#888888',
        smoke: '#1A1714',
      },
      fontFamily: {
        display: ['"Big Shoulders Display Variable"', 'Impact', 'sans-serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        ember: '0 0 40px -8px rgba(255,106,0,.55)',
      },
      keyframes: {
        flicker: { '0%,100%': { opacity: '.85' }, '45%': { opacity: '1' }, '60%': { opacity: '.7' } },
        drift: { '0%': { transform: 'translate3d(0,0,0) scale(1)', opacity: '0' }, '20%': { opacity: '.5' }, '100%': { transform: 'translate3d(30px,-160px,0) scale(1.6)', opacity: '0' } },
        rise: { '0%': { transform: 'translate3d(0,0,0)', opacity: '0' }, '10%': { opacity: '1' }, '100%': { transform: 'translate3d(var(--dx),-70vh,0)', opacity: '0' } },
      },
      animation: {
        flicker: 'flicker 3s ease-in-out infinite',
        drift: 'drift 9s ease-out infinite',
        rise: 'rise var(--t) linear infinite',
      },
    },
  },
  plugins: [],
};
