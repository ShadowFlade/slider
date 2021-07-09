module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base/legacy', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'eslint no-underscore-dangle': 'allow',
    'eslint semi': ['error', 'never'],
    'comma-dangle': 'off',
    'eslint quotes': 'off',
  },
}
