/* eslint-disable prettier/prettier */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'prettier',
    // 'prettier/@typescript-eslint',
    'airbnb-base/legacy',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {

    'prettier/prettier': [1, { singleQuote: true, parser: 'flow' }],
    'comma-dangle': 0,
    'no-underscore-dangle': 0,
    semi: 0,
    quotes: 0,
  },
};
