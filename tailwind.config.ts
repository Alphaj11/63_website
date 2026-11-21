import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coal: { DEFAULT: '#151515', 900: '#0d0d0d', 800: '#1c1b1a', 700: '#262422', 600: '#33302d' },
        ember: { DEFAULT: '#D34B25', 600: '#b93d1b', 400: '#e2683f', 300: '#ef8b62' },
        crust: { DEFAULT: '#E9C88D', 600: '#cfa866', 300: '#f3dfb7' },
        bone: '#f4ede2',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        serif: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { megawide: '0.32em' },
      keyframes: {
        flicker: { '0%,100%': { opacity: '0.85' }, '45%': { opacity: '1' }, '60%': { opacity: '0.7' } },
        drift: { '0%': { transform: 'translate3d(-10%,0,0) scale(1)' }, '100%': { transform: 'translate3d(10%,-6%,0) scale(1.2)' } },
        rise: { '0%': { transform: 'translateY(0)', opacity: '0' }, '15%': { opacity: '1' }, '100%': { transform: 'translateY(-120vh)', opacity: '0' } },
      },
      animation: {
        flicker: 'flicker 2.4s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
} satisfies Config;
