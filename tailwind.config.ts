import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", 'sans-serif'],
        inter: ["Inter", 'sans-serif'],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        primary: "#01ABE8",
        secondary: "#f8fafc",
        light_gray: "#F3F5F6",
        high_gray: "#AEB3B5",
        base_gray: "#F3F5F6",
        high_blue: "#00AAE7",
        base_blue: "#c3e9f8",
        light_blue: "#E6F5FB",

      },
      backgroundImage:{
        soft_diagonal: 'linear-gradient(to bottom right, #FBFCFD, #EDEDED)',
      }
    },
  },
  plugins: [],
} satisfies Config;
