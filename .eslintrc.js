module.exports = {
  root: true,
  extends: [require.resolve('@mango-scripts/esp-config/eslint')],
  rules: {},
  overrides: [
    {
      files: ['./packages/server/**/*.{js,jsx,mjs,ts,tsx,mts}'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'off',
      },
    },
  ],
}
