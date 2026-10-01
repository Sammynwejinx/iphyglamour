/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1B1516',
        porcelain: '#FBF7F5',
        magenta: '#B01655',
        magentadeep: '#7A0E3B',
        blush: '#F1DCE2',
        sand: '#EDE6DF',
        gold: '#A9843F'
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif']
      }
    }
  },
  plugins: []
};
