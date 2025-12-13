/** @type {import('tailwindcss').Config} */

export default {

  content: ["./index.html", "./src/**/*.{js,jsx}"],
  
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#2A195C",
          accent: "#CDFF64",
          light: "#E7E0FF",
          soft: "#D4C6FF",
          medium: "#A286DC",
        },
      },
      
      fontFamily: {
        primary: ["Metropolis", "Poppins", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
        '2xl': "18px",
      },
    },
  },
  plugins: [],

  


};

