import * as fs from 'fs'
import { resolve } from 'path'
import { Author, Setting } from '@tryghost/content-api'
import { Configuration } from '@nuxt/types'
import dotenv from 'dotenv'
import setting from './.data/settings.json'
import authors from './.data/authors.json'

dotenv.config()

const author: Author = authors.authors[0]

const settings: Setting = (setting as any).settings

const dataDir = resolve(__dirname, '.data')

const extendRoutesStr = fs.readFileSync(resolve(dataDir, 'routes.json'), {
  encoding: 'utf8'
})
const extendRoutes = JSON.parse(extendRoutesStr)

const config: Configuration = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: settings.title || process.env.npm_package_name || '',
    titleTemplate: `%s - ${settings.title}`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'description',
        name: 'description',
        content:
          settings.description || process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  env: {
    URL: process.env.URL!,
    APP_ID: process.env.APP_ID!,
    SEARCH_KEY: process.env.SEARCH_KEY!
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#ff470f' },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/main', '~/assets/css/dark'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/ghost', '~/plugins/dayjs'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxt/typescript-build',
    '~/modules/generate-supporter'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/bulma
    // '@nuxtjs/bulma',
    '@nuxtjs/pwa',
    'nuxt-payload-extractor',
    '@nuxtjs/axios'
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extractCSS: true
  },
  typescript: {
    ignoreNotFoundWarnings: true
  },
  generate: {
    routes: () => [...extendRoutes],
    fallback: true
  },
  router: {
    linkActiveClass: 'is-active',
    linkExactActiveClass: 'is-active'
  },
  serverMiddleware: ['~/api/index.ts'],
  axios: {
    prefix: '/api',
    proxy: true
  },
  pwa: {
    workbox: {
      runtimeCaching: [
        {
          urlPattern:
            '^https://private-backend.unsweets.net/content/images/(.*)',
          handler: 'cacheFirst'
        },
        {
          urlPattern: '^https://images.unsplash.com/(.*)',
          handler: 'cacheFirst'
        }
      ]
    },
    meta: {
      name: settings.title,
      description: settings.description,
      author: author.name,
      lang: settings.lang,
      ogTitle: null,
      ogSiteName: settings.title,
      ogDescription: null
    }
  }
}

export default config
