/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  // See https://vuejs.org/style-guide for more information on the rationale behind the style guide, and https://eslint.vuejs.org/ for the
  // full documentation of eslint-rules implementing the style guide.
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', '@vue/eslint-config-prettier'],
  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/no-v-html': 'off',
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
}
