import Vue from 'vue'
import { Settings } from '@tryghost/content-api'
import { Plugin } from '@nuxt/types'
import settings from '~/.data/settings.json'
import {
  $resolvePostUrl,
  $createSocialMediaMeta,
  $createBaseMetadata,
  $resolveUrl,
  $replaceHostWithOriginal
} from '~/util/util'

Vue.prototype.$resolvePostUrl = $resolvePostUrl
Vue.prototype.$resolveUrl = $resolveUrl
Vue.prototype.$settings = settings
Vue.prototype.$createSocialMediaMeta = $createSocialMediaMeta
Vue.prototype.$createBaseMetadata = $createBaseMetadata
Vue.prototype.$replaceHostWithOriginal = $replaceHostWithOriginal

const plugin: Plugin = (context) => {
  context.$resolvePostUrl = $resolvePostUrl
  context.$resolveUrl = $resolveUrl
  context.$replaceHostWithOriginal = $replaceHostWithOriginal
}
export default plugin

declare module 'vue/types/vue' {
  interface Vue {
    $resolvePostUrl: typeof $resolvePostUrl
    $resolveUrl: typeof $resolveUrl
    $settings: Settings
    $createSocialMediaMeta: typeof $createSocialMediaMeta
    $createBaseMetadata: typeof $createBaseMetadata
    $replaceHostWithOriginal: typeof $replaceHostWithOriginal
  }
}

declare module '@nuxt/types' {
  interface Context {
    $resolvePostUrl: typeof $resolvePostUrl
    $resolveUrl: typeof $resolveUrl
    $replaceHostWithOriginal: typeof $replaceHostWithOriginal
  }
}
