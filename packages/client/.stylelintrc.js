module.exports = {
  extends: [require.resolve('@mango-scripts/esp-config/stylelint')],
  rules: {
    'function-no-unknown': null,
    'scss/no-global-function-names': null,
    'no-descending-specificity': null,
    'scss/at-import-partial-extension': null,
    'font-family-no-missing-generic-family-keyword': null,
  },
}
