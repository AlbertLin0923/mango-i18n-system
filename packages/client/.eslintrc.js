// https://eslint.org/docs/user-guide/configuring
module.exports = {
  extends: ['react-app', 'react-app/jest', 'plugin:prettier/recommended'],
  // add your custom rules here
  rules: {
    'prettier/prettier': 'warn',
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
