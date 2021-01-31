import * as fs from 'fs'
import { resolve } from 'path'
import { Author, Settings } from '@tryghost/content-api'
import { NuxtConfig } from '@nuxt/types'
import setting from './.data/settings.json'
import authors from './.data/authors.json'

const author: Author = authors.authors[0]

const settings: Settings = (setting as any).settings

const dataDir = resolve(__dirname, '.data')

const extendRoutesStr = fs.readFileSync(resolve(dataDir, 'routes.json'), {
  encoding: 'utf8'
})
const extendRoutes = JSON.parse(extendRoutesStr)

const config: NuxtConfig = {
  ssr: true,
  target: 'static',
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
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'dns-prefetch', href: '//private-backend.unsweets.net' }
    ]
  },

  env: {
    URL: process.env.URL!
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
  plugins: ['~/plugins/ghost', '~/plugins/dayjs', '~/plugins/uniqueId'],
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
    '@nuxtjs/sentry',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/http'
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    postcss: {
      plugins: {
        'extract-color-properties': {
          excludeProperties: []
        }
      }
    }
  },
  typescript: {
    ignoreNotFoundWarnings: true
  },
  generate: {
    routes: () => [...extendRoutes],
    fallback: true,
    crawler: false
  },
  router: {
    linkActiveClass: 'is-active',
    linkExactActiveClass: 'is-active'
  },
  serverMiddleware: [
    {
      path: '/api/search',
      handler: '~/api/search.ts',
      prefix: false
    },
    {
      path: '/api/resources',
      handler: '~/api/resources/[resource].ts',
      prefix: false
    }
  ],
  pwa: {
    workbox: {
      runtimeCaching: [
        {
          urlPattern: '^https://images.unsplash.com/(.*)',
          handler: 'cacheFirst'
        },
        {
          urlPattern: '\\.html$',
          handler: 'networkFirst',
          strategyOptions: {
            cacheExpiration: {
              maxAgeSeconds: 60 * 60 * 24
            }
          }
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
    },
    manifest: {
      name: settings.title,
      lang: 'ja',
      short_name: settings.title,
      description: settings.description,
      display: 'browser'
    }
  },
  sentry: {
    dsn: 'https://7642264ea97649a18dea1c78159a5d21@sentry.io/5180766',
    disabled: process.env.NODE_ENV !== 'production'
  },
  sitemap: {
    hostname: process.env.URL,
    gzip: true,
    routes: [...extendRoutes]
  },
  robots: {
    UserAgent: '*',
    Allow: '/'
  },
  http: {
    baseURL: 'http://localhost:3000/api',
    browserBaseURL: '/api'
  }
}

export default config
