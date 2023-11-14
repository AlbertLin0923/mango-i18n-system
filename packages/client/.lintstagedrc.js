module.exports = {
  '**/*.{js,jsx,ts,tsx}': 'eslint --fix',
  '**/*.{less,scss,sass,stylus,styl,css}': 'stylelint --fix',
  '**/*.{js,jsx,ts,tsx,less,scss,sass,stylus,styl,css,md,html,json}':
    'prettier --write',
}
