/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Prettier success rate colors - vibrant gradient from red to green
        'success-rate-0': 'oklch(0.45 0.18 15)',      // Deep red
        'success-rate-10': 'oklch(0.5 0.2 25)',       // Red-orange
        'success-rate-20': 'oklch(0.55 0.19 40)',     // Orange
        'success-rate-30': 'oklch(0.6 0.17 55)',      // Yellow-orange
        'success-rate-40': 'oklch(0.65 0.15 70)',    // Yellow
        'success-rate-50': 'oklch(0.7 0.13 85)',     // Yellow-green
        'success-rate-60': 'oklch(0.75 0.11 100)',   // Light green
        'success-rate-70': 'oklch(0.78 0.09 120)',   // Green
        'success-rate-80': 'oklch(0.82 0.07 140)',   // Bright green
        'success-rate-90': 'oklch(0.88 0.05 155)',   // Emerald green
        'success-rate-95': 'oklch(0.92 0.03 160)',   // Vibrant green
        'success-rate-100': 'oklch(0.95 0.025 165)', // Brilliant green
        'success-rate-nan': 'oklch(0.4 0.05 0)',     // Dark gray for NaN
      },
    },
  },
  plugins: [],
}
