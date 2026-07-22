import preset from 'cf-tokens/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/cf-ui/**/*.{js,mjs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
