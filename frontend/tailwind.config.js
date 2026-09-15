/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: {
      none: '0px',
      sm: '2px',
      DEFAULT: '4px',
      md: '4px',
      lg: '6px',
      xl: '6px',
      '2xl': '6px',
      '3xl': '6px',
      full: '9999px',
    },
    extend: {
      colors: {
        brand: {
          50: '#f4f4f6',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
          500: '#18181b', // Vercel/Linear Deep Black
          600: '#09090b', // Pure Contrast Black
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000',
        },
        saas: {
          bg: '#F4F4F6',
          card: '#FFFFFF',
          border: '#E4E4E7',
          'border-dark': '#27272A',
          muted: '#71717A',
          subtle: '#FAFAFA',
          black: '#09090B',
          dark: '#111111'
        },
        slate: {
          950: '#F4F4F6', // Page background
          900: '#FFFFFF', // Clean White Cards
          850: '#FAFAFA',
          800: '#F4F4F5', // Subtle secondary blocks
          750: '#ECECEE',
          700: '#E4E4E7', // Light crisp borders
          600: '#A1A1AA',
          500: '#71717A', // Secondary metadata text
          400: '#52525B', // Subtext
          300: '#27272A', // Body dark text
          200: '#18181B', // High contrast text
          100: '#09090B', // Primary deep text
          50: '#000000'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'saas-card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'saas-elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'saas-btn': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}


