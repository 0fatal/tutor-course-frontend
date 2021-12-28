module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
  },
  env: {
    browser: true
  },
  extends: ['plugin:vue/essential', 'plugin:prettier/recommended'],
  plugins: ['vue'],
}
