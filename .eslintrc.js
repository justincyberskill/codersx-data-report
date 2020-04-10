module.exports = {
  parser: 'babel-eslint',
  extends: ['plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        tabWidth: 2
      }
    ],
    'no-debugger': 'error',
    'no-console': 'warn'
  }
};
