/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
 theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui'],
    },
   },
  extend: {
  keyframes: {
    'fade-slide': {
      '0%': { opacity: '0', transform: 'translateY(10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
  },
  animation: {
    'fade-slide': 'fade-slide 0.3s ease-out',
  },
},
},
 plugins: [require('@tailwindcss/typography'), require('daisyui')],
};