/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7fe',
          100: '#e7edfc',
          200: '#ccdbf8',
          300: '#a4bff2',
          400: '#769ce9',
          500: '#4a73dd',
          600: '#3459c4',
          700: '#2b47a0',
          800: '#253b81',
          900: '#22346a',
          950: '#161d3f',
        },
        accent: {
          100: '#fff5e6',
          200: '#ffe0b3',
          300: '#ffc680',
          400: '#ffac4d',
          500: '#ff921a',
          600: '#db7307',
          700: '#b25405',
          800: '#8a3b04',
          900: '#6e2b03',
        },
      },
      fontFamily: {
        heading: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        elevated: '0 24px 60px -15px rgba(18, 38, 99, 0.35)',
      },
    },
  },
  plugins: [],
};

