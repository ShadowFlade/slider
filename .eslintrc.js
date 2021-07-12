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
    'comma-dangle': 0,
    'no-underscore-dangle': 0,
    semi: 0,
    quotes: 0,
  },
}
