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
        'dark-bg': '#1a1a1a',
        'card-bg': '#2a2a2a',
        'accent-red': '#ff4458',
        'accent-blue': '#4a90e2',
        'text-primary': '#ffffff',
        'text-secondary': '#b0b0b0',
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'inter': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'amiri': ['var(--font-amiri)', 'serif'],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        'gradient-card': 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
      },
    },
  },
  plugins: [],
}
