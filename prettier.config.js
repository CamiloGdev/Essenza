/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  singleQuote: true,
  printWidth: 120,
  overrides: [
    {
      files: ['*.json', '*.jsonc'],
      options: {
        printWidth: 100,
      },
    },
  ],
}

export default config
