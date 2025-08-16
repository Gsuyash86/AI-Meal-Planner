/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
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
          'dark-card': '#1A1A1A',
          'dark-border': '#2A2A2A',
          'dark-hover': '#252525',
          'text-primary': '#FFFFFF',
          'text-secondary': '#B3B3B3',
          'text-muted': '#666666',
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['Fira Code', 'monospace'],
        },
        backgroundImage: {
          'cred-gradient': 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #06B6D4 100%)',
          'dark-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
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
            '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
            '100%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' },
          },
        },
      },
    },
    plugins: [],
  }