module.exports = {
  '**/*.{js,jsx,ts,tsx}': 'eslint --fix',
  '**/*.{less,scss,sass,css}': 'stylelint --fix',
  '**/*.{js,jsx,ts,tsx,less,scss,sass,css,md,json}': ['prettier --write']
}
