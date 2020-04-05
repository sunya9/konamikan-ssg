module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true
  },

  extends: [
    '@nuxtjs/eslint-config-typescript',
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {}
}
