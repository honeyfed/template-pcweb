
  module.exports = {
    env: {
      browser: true,
    },
    parserOptions: {
      parser: "babel-eslint",
      ecmaVersion: 2017,
      sourceType: "module",
    },
    extends: ["plugin:vue/essential","plugin:react/recommended","eslint-config-tencent"],
    plugins: ["vue","react"],
  };
  