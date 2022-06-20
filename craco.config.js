const path = require("path");

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, "src/components/"),
      '@modules': path.resolve(__dirname, "src/modules/"),
      '@pages': path.resolve(__dirname, "src/pages/"),
      '@utils': path.resolve(__dirname, "src/utils/"),
      '@hooks': path.resolve(__dirname, "src/utils/hooks"),
      '@assets': path.resolve(__dirname, "src/assets/"),
      '@fonts': path.resolve(__dirname, "src/fonts/"),
      '@styles': path.resolve(__dirname, "src/assets/scss/"),
      '@images': path.resolve(__dirname, "src/assets/images/"),
      '@constants': path.resolve(__dirname, "src/config/constants/"),
      '@abis': path.resolve(__dirname, "src/config/abis/")
    }
  }
};