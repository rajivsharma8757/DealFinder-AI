/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#101312',
          surface: '#191F1C',
          card: '#1D2420',
          elevated: '#222B26',
        },
        border: {
          DEFAULT: '#2A352F',
          muted: '#202924',
          subtle: '#1C2420',
        },
        brand: {
          green: '#22C55E',
          emerald: '#10B981',
          accent: '#86EFAC',
          dark: '#14532D',
          hover: '#16A34A',
        },
        text: {
          primary: '#F5F7F5',
          secondary: '#A7B0AA',
          muted: '#6F7872',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
