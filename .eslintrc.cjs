/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  // TOOD: Examine option of using the recommended vue plugin instead of just the strongly recommded,
  //  to be completly in line with vue's style guide
  extends: ['plugin:vue/vue3-strongly-recommended', 'eslint:recommended', '@vue/eslint-config-prettier'],
  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
}
