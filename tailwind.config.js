/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: "var(--font-outfit)",
        montserrat: "var(--font-montserrat)",
      },
      colors: {
        primary: "#E64040",
        highlight: "#29AFEC",
      },
      boxShadow: {
        productShadow: "0 0 60px -15px rgba(0, 0, 0, 0.3)",
        productCarouselShadow: "0 0 40px -10px rgba(0, 0, 0, 0.3)",
        centeredShadow: "0 0 4px 1px #d3d3d3",
      },
      padding: {
        body: "4%",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        muscleShowGradiantTextBlock: "linear-gradient(180deg, rgba(218,57,57,0.25) 0%, rgba(255,255,255,1) 84%)",
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1536px",
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/line-clamp"),
  ],
};
