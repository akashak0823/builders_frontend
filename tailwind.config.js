/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#1E3353', // Dark Navy (Text: BUILDERS)
          800: '#2A446B',
          700: '#365583',
        },
        gold: {
          400: '#F2C23E', // Yellow/Gold (Highlight)
          500: '#D9A92E',
        },
        brown: {
          500: '#C47A33', // Orange-Brown
        },
        bluegrey: {
          500: '#3F4A5A', // Muted Blue-Grey
        },
        light: {
          100: '#E6EAEE', // Light Grey Background
          50: '#FFFFFF',
        },
        accent: {
          green: '#3DAA57',
          darkgreen: '#226C35',
          brick: '#A85632',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'], // Adding Montserrat as user mentioned it in history
      },
      boxShadow: {
        '3d': '0 10px 15px -3px rgba(30, 51, 83, 0.1), 0 4px 6px -2px rgba(30, 51, 83, 0.05)',
        '3d-hover': '0 20px 25px -5px rgba(30, 51, 83, 0.1), 0 10px 10px -5px rgba(30, 51, 83, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
