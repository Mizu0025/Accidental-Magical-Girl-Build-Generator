const path = require("path");

module.exports = {
  entry: "./src/index.jsx", // Update to the new entry file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    alias: {
      "@Character": path.resolve(__dirname, "src/Character/"),
      "@Dice": path.resolve(__dirname, "src/Dice/"),
      "@Helpers": path.resolve(__dirname, "src/Helpers/"),
      "@Stats": path.resolve(__dirname, "src/Stats/"),
      "@Currency": path.resolve(__dirname, "src/Currency/"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"], // Add .jsx and .tsx
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // Optional: Add support for CSS files if needed
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  devServer: {
    compress: true,
    port: 9000,
  },
};
