module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true
  },

  extends: [
    'eslint:recommended',
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
    'prettier/vue'
  ],
  // add your custom rules here
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error'
  }
}
