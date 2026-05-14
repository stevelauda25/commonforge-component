import preset from 'pod-test-tokens/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/pod-test-ui/**/*.{js,mjs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
