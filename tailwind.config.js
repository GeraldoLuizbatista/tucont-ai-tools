module.exports = {
  content: ['./pages/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0A0F14',
          card: 'rgba(20, 25, 30, 0.6)',
        },
        primary: {
          orange: '#FDB913',
          cyan: '#2DD4BF',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(253, 185, 19, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(253, 185, 19, 0.8)' },
        }
      }
    }
  },
  plugins: [],
}
