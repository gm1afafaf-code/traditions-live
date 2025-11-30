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
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
