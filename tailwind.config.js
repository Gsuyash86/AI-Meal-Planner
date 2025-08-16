/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
      },
      extend: {
        colors: {
          background: '#0A0A0A',
          foreground: '#FFFFFF',
          'cred-purple': '#6366F1',
          'cred-pink': '#EC4899',
          'cred-cyan': '#06B6D4',
          'cred-green': '#10B981',
          'cred-orange': '#F59E0B',
          'cred-red': '#EF4444',
          'surface': '#0F1014',
          'surface-2': '#15161C',
          'dark-card': '#16171E',
          'dark-border': '#22232B',
          'dark-hover': '#1D1E25',
          'text-primary': '#FFFFFF',
          'text-secondary': '#B3B3B3',
          'text-muted': '#777B86',
          'accent': '#8B5CF6',
          'accent-2': '#EC4899',
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['Fira Code', 'monospace'],
        },
        borderRadius: {
          xl: '1rem',
          '2xl': '1.25rem',
        },
        boxShadow: {
          'cred-soft': '0 10px 30px -10px rgba(139, 92, 246, 0.25)',
          'cred-strong': '0 20px 50px -10px rgba(139, 92, 246, 0.35)',
          'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.05)',
        },
        backgroundImage: {
          'cred-gradient': 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #06B6D4 100%)',
          'dark-gradient': 'linear-gradient(135deg, #111214 0%, #1A1B22 100%)',
          'radial-faint': 'radial-gradient(1200px 600px at 50% -50%, rgba(139,92,246,0.12), rgba(0,0,0,0))',
        },
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'pulse-slow': 'pulse 3s ease-in-out infinite',
          'glow': 'glow 2s ease-in-out infinite alternate',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          glow: {
            '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)' },
            '100%': { boxShadow: '0 0 36px rgba(236, 72, 153, 0.45)' },
          },
        },
      },
    },
    plugins: [],
  }