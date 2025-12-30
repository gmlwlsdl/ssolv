const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './apps/web/src/app/globals.css',
};
export default prettierConfig;
