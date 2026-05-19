import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

const tsRules = {
  '@typescript-eslint/no-non-null-assertion': 'error',
  '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
}

export default tseslint.config(
  ...pluginVue.configs['flat/essential'],
  {
    files: ['src/**/*.ts'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: { parser: tseslint.parser },
    rules: tsRules,
  },
  {
    files: ['src/**/*.vue'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
    rules: tsRules,
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**', 'tests/**'],
  },
)
