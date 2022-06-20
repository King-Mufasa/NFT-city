module.exports = {
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          primary: {
            DEFAULT: "#000011",
            light: "#545454",
            100: "#a7a4a4",
            200: "#a7a4a4",
            300: "#a7a4a4"
          },
          black: {
            transparent: "#000000Af"
          },
          orange: {
            DEFAULT: "#FF6B00"
          },
          pink: {
            DEFAULT: "#B429CF"
          },
          green: {
            DEFAULT: "#2cce8f"
          },
          trans: {
            DEFAULT: "#B4290001"
          },
          red: {
            DEFAULT: "#d50000"
          },
          blue:{
            DEFAULT: "#03a9f4"
          }
        }
      },
      fontFamily: {
        "nordeco": ["nordeco"],
        "nordeco-bold": ["nordeco-bold"],
      },
      maxWidth: {
        30: "300px",
        50: "500px",
        max: "max-content",
      },
      borderRadius: {
        DEFAULT: '4px',
        'none': '0',
        'sm': '0.125rem',
        'md': '4px',
        'lg': '0.5rem',
        'full': '9999px',
        'large': '12px',
      }
    },
  },
  plugins: [],
}
