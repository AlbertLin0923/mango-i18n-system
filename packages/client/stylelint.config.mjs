import stylelint from '@mango-scripts/esp-config/stylelint'

/** @type {import("stylelint").Config} */
const config = {
  ...stylelint,
  rules: {
    'function-no-unknown': null,
    'scss/no-global-function-names': null,
    'no-descending-specificity': null,
    'scss/at-import-partial-extension': null,
    'font-family-no-missing-generic-family-keyword': null,
  },
}
export default config
