/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Extend with custom colors if needed, but for now we'll use default Tailwind colors
        // and potentially map the existing CSS variables to Tailwind colors if we want to keep the exact look
      },
    },
  },
  plugins: [],
}
