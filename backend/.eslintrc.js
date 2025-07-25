module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    // Tắt một số rules không cần thiết
    'no-unused-vars': 'warn',
    'no-console': 'off',
  },
};
