/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0A0A0A",
          secondary: "#1A1A1A",
          hover: "#252525",
        },
        primary: {
          DEFAULT: "#1D4ED8",
          hover: "#323232",
        },
        success: {
          DEFAULT: "#10B981",
          hover: "#059669",
        },
        error: {
          DEFAULT: "#EF4444",
          hover: "#DC2626",
        },
        warning: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#A1A1AA",
          disabled: "#52525B",
        },
      },
    },
    fontFamily: {
      sans: ["Mulish", "sans-serif"],
    },
    fontWeight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  plugins: [],
};
