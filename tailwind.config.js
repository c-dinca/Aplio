/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': '#F0F4FF',
        'blue-primary': '#2563EB',
        'blue-dark': '#1D4ED8',
        'orange-primary': '#F97316',
        'orange-dark': '#EA580C',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
      },
      borderRadius: {
        glass: '20px',
        btn: '12px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
