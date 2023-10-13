/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,js,ts}'],
  theme: {
    extend: {},
  },
  plugins: [ require('daisyui'), require('@tailwindcss/aspect-ratio') ],
  daisyui: {
    themes: [ "corporate" ],
  }
}

