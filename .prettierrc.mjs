import sisterSoftwarePrettierConfig from '@sister.software/prettier-config'

/**
 * @type {import('prettier').Options}
 */
const prettierConfig = {
  ...sisterSoftwarePrettierConfig,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'es5',
  singleQuote: true,
  plugins: ['prettier-plugin-organize-imports'],
  organizeImportsSkipDestructiveCodeActions: false,
}

export default prettierConfig
