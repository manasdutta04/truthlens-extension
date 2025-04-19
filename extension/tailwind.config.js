/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      colors: {
        'truthlens-primary': '#3b82f6',
        'truthlens-secondary': '#6366f1',
        'truthlens-success': '#10b981',
        'truthlens-warning': '#f59e0b',
        'truthlens-danger': '#ef4444',
      },
    },
  },
  plugins: [],
}; 