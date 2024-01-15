/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      container: {
        padding: {
          DEFAULT: '20px',
          md: '10px'
        },
        center: true,
        screens: {
          sm: '100%',
          md: '100%',
          lg: '100%',
          xl: '1180px'
        }
      }
    }
  },
  plugins: []
};
