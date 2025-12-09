import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '120rem'
      },
      colors: {
        // Dark theme colors
        dark: {
          DEFAULT: '#0d0d0d',
          50: '#1a1a1a',
          100: '#141414',
          200: '#0f0f0f',
          300: '#0a0a0a',
        },
        // Green accent colors (cannabis theme)
        emerald: {
          DEFAULT: '#10b981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Legacy colors (kept for compatibility)
        marble: '#fafaf9',
        'marble-dark': '#f5f5f4',
        charcoal: '#1a1a1a',
        slate: '#404040',
        gold: '#b8a369',
        'gold-muted': '#c4b896',
        'gold-dark': '#a08d5c',
        void: '#0a0a0a',
        obsidian: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        display: ['Bebas Neue', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(180deg, rgba(13,13,13,0.8) 0%, rgba(13,13,13,0.95) 100%)',
      },
    },
  },
  plugins: [
    forms,
  ],
}
