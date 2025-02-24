const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        colour1: "#F2F4FB",
        colour2: "#FF9280",
        colour3: "#FF2400",
        colour4: "#45315D"
      }
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}