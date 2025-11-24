import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#b6d6ff',
          300: '#85b9ff',
          400: '#5292ff',
          500: '#2e6cff',
          600: '#1e51f0',
          700: '#1a41c4',
          800: '#1a38a0',
          900: '#1a327f'
        }
      }
    }
  },
  plugins: []
};

export default config;

