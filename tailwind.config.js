/** @type {import('tailwindcss').Config} */

// Theme colors are CSS variables (see app/styles/globals.css) so every
// existing gray-*/primary-* class switches automatically in dark mode.
const token = name => `rgb(var(--${name}) / <alpha-value>)`
const scale = (prefix, steps) => Object.fromEntries(steps.map(s => [s, token(`${prefix}-${s}`)]))

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/streamdown/dist/*.js',
  ],
  theme: {
    typography: require('./typography'),
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        gray: scale('gray', [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        primary: { DEFAULT: token('primary-600'), ...scale('primary', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) },
        canvas: token('canvas'),
        surface: token('surface'),
        'surface-raised': token('surface-raised'),
        line: token('line'),
        // tokens used by the streamdown markdown renderer
        border: token('line'),
        foreground: token('gray-900'),
        background: token('surface'),
        muted: { DEFAULT: token('gray-100'), foreground: token('gray-500') },
        blue: {
          500: token('primary-50'),
        },
        green: {
          50: '#F3FAF7',
          100: '#DEF7EC',
          800: '#03543F',
        },
        yellow: {
          100: '#FDF6B2',
          800: '#723B13',
        },
        purple: {
          50: '#F6F5FF',
        },
        indigo: {
          25: '#F5F8FF',
          100: '#E0EAFF',
          600: '#444CE7',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgb(16 24 40 / 0.04), 0 1px 3px rgb(16 24 40 / 0.06)',
        composer: '0 8px 24px -6px rgb(16 24 40 / 0.12), 0 2px 6px -2px rgb(16 24 40 / 0.06)',
      },
      screens: {
        mobile: '100px',
        // => @media (min-width: 100px) { ... }
        tablet: '640px', // 391
        // => @media (min-width: 600px) { ... }
        pc: '769px',
        // => @media (min-width: 769px) { ... }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
