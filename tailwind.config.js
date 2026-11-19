/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#173C2C',
          50: '#F2F7F4',
          100: '#E1EDE6',
          200: '#C2DBCB',
          300: '#94BEA5',
          400: '#5C9A77',
          500: '#3A7C57',
          600: '#2A6345',
          700: '#214E37',
          800: '#173C2C', // Primary Brand Forest Green
          900: '#0F261C',
        },
        paddy: {
          DEFAULT: '#477A42',
          50: '#F4F8F3',
          100: '#E4F0E2',
          200: '#C8E1C4',
          300: '#9EC997',
          400: '#6FA967',
          500: '#477A42', // Primary Paddy Green
          600: '#396335',
          700: '#2D4E2A',
          800: '#233E21',
          900: '#182C17',
        },
        harvest: {
          DEFAULT: '#E4B94F',
          50: '#FDFBF5',
          100: '#FBF5E5',
          200: '#F6E7BF',
          300: '#EFCF8E',
          400: '#E8BF65',
          500: '#E4B94F', // Harvest Gold
          600: '#C99E35',
          700: '#A47D22',
          800: '#7F5E16',
          900: '#5B410D',
        },
        cream: {
          DEFAULT: '#F8F5E9',
          50: '#FFFFFF',
          100: '#FCFBF5',
          200: '#F8F5E9', // Warm Cream background
          300: '#EDE7CD',
          400: '#DED3A7',
          500: '#CDBE82',
        },
        terracotta: {
          DEFAULT: '#C76E48',
          50: '#FCF6F4',
          100: '#F7E9E3',
          200: '#EED0C3',
          300: '#E1AC97',
          400: '#D48666',
          500: '#C76E48', // Earthy Terracotta
          600: '#AA5431',
          700: '#864124',
          800: '#64301A',
          900: '#462111',
        },
        sage: {
          DEFAULT: '#DCE8D3',
          50: '#F9FAF8',
          100: '#F1F6ED',
          200: '#DCE8D3', // Soft Sage
          300: '#C2D6B5',
          400: '#A5C094',
          500: '#8AA977',
        },
        ink: {
          DEFAULT: '#26332B',
          50: '#F4F6F5',
          100: '#E5E9E6',
          200: '#CAD3CC',
          300: '#A5B5A9',
          400: '#758C7C',
          500: '#4F6656',
          600: '#394A3E',
          700: '#2D3A31',
          800: '#26332B', // Deep Charcoal Ink
          900: '#171F1A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'paddy-lines': "radial-gradient(ellipse at 50% -20%, rgba(228, 185, 79, 0.15), transparent 70%), linear-gradient(180deg, #F8F5E9 0%, #FFFFFF 100%)",
        'harvest-glow': "radial-gradient(circle at top right, rgba(228,185,79,0.2) 0%, transparent 60%)",
      },
      boxShadow: {
        'agro': '0 4px 20px -2px rgba(23, 60, 44, 0.08), 0 2px 6px -1px rgba(23, 60, 44, 0.04)',
        'agro-lg': '0 10px 30px -4px rgba(23, 60, 44, 0.12), 0 4px 10px -2px rgba(23, 60, 44, 0.06)',
        'gold': '0 4px 20px -2px rgba(228, 185, 79, 0.25)',
      }
    },
  },
  plugins: [],
}
