/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FC8A06",
          hover: "#FC8A06",
          ink: "#03081F",
          green: "#028643",
          surface: "#FAFAFA",
          hero: "#FBFBFB",
        },
      },
    },
  },
};
