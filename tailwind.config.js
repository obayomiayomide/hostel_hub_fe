/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B1320',
          900: '#101A2C',
          800: '#16223A',
          700: '#1E3354',
          600: '#274572',
        },
        brand: {
          50: '#EFF5FF',
          100: '#DCE9FF',
          200: '#B9D2FF',
          300: '#8FB6FF',
          400: '#5C92F2',
          500: '#2F6FE0',
          600: '#1E54BD',
          700: '#173F92',
          800: '#142F6B',
          900: '#0F2249',
        },
        amber: {
          50: '#FFF8EB',
          100: '#FFEDC2',
          200: '#FFDD8F',
          300: '#FBC857',
          400: '#F1AE2E',
          500: '#DB9320',
          600: '#B5731A',
        },
        slate: {
          25: '#F7F8FA',
        },
      },
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 26, 44, 0.06), 0 1px 3px 0 rgba(16, 26, 44, 0.08)',
        elevated: '0 4px 16px -2px rgba(16, 26, 44, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
