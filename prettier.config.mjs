import prettier from '@mango-scripts/esp-config/prettier'

/** @type {import("prettier").Config} */
const config = {
  ...prettier,
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
