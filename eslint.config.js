import antfu from '@antfu/eslint-config'

const config = antfu({
  autoRenamePlugins: false,
  formatters: {
    astro: false,
    markdown: 'prettier',
  },
  typescript: {
    tsconfigPath: 'tsconfig.json',

  },
  unocss: true,
  astro: true,
}, {
  name: 'stylistic overrides',
  rules: {
    'antfu/if-newline': 'off',
    'style/operator-linebreak': 'off',
    'style/brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'ts/strict-boolean-expressions': 'off',
  },
}, {
  name: 'pages top-level await is acceptable',
  files: [
    './src/pages/**/*.ts',
  ],
  rules: {
    'antfu/no-top-level-await': 'off',
  },
})
export default config
