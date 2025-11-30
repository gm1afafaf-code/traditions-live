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
        // Luxury Black Marble Palette
        'void': '#0a0a0a',
        'obsidian': '#0d0d0d',
        'onyx': '#121212',
        'graphite': '#1a1a1a',
        'slate-dark': '#252525',
        'marble-vein': '#2a2a2a',
        
        // Gold Accents
        'gold': {
          DEFAULT: '#d4af37',
          light: '#f4d03f',
          dark: '#b8860b',
          muted: '#c4a052',
          pale: '#e8d5a3',
        },
        
        // Legacy colors for compatibility
        marble: '#fafaf9',
        'marble-dark': '#f5f5f4',
        charcoal: '#1a1a1a',
        slate: '#404040',
        'gold-muted': '#c4b896',
        'gold-dark': '#a08d5c',
        void: '#0a0a0a',
        obsidian: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'marble-texture': `
          radial-gradient(ellipse at 20% 30%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(212, 175, 55, 0.02) 0%, transparent 40%),
          linear-gradient(135deg, #0a0a0a 0%, #121212 50%, #0d0d0d 100%)
        `,
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #b8860b 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)',
        'vein-pattern': `
          linear-gradient(45deg, transparent 40%, rgba(212, 175, 55, 0.08) 45%, rgba(212, 175, 55, 0.08) 55%, transparent 60%),
          linear-gradient(-45deg, transparent 40%, rgba(212, 175, 55, 0.05) 45%, rgba(212, 175, 55, 0.05) 55%, transparent 60%)
        `,
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.4)',
        'gold-glow': '0 0 60px rgba(212, 175, 55, 0.5), 0 0 100px rgba(212, 175, 55, 0.3)',
        'inner-gold': 'inset 0 0 30px rgba(212, 175, 55, 0.1)',
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'vein-flow': 'veinFlow 8s linear infinite',
        'counter': 'counter 2s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'curtain-rise': 'curtainRise 2s ease-out forwards',
        'leaf-fall': 'leafFall 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
        veinFlow: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        curtainRise: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        leafFall: {
          '0%': { transform: 'translateY(-10%) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
