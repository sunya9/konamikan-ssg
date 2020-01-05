import Vue from 'vue'
import { Setting } from '@tryghost/content-api'
import { Route } from 'vue-router'
import { Plugin } from '@nuxt/types'
import setting from '~/.data/settings.json'
import {
  $resolvePostUrl,
  $createSocialMediaMeta,
  $createBaseMetadata,
  $resolveUrl
} from '~/util/util'

Vue.prototype.$resolvePostUrl = $resolvePostUrl
Vue.prototype.$resolveUrl = $resolveUrl
Vue.prototype.$setting = setting.settings
Vue.prototype.$createSocialMediaMeta = $createSocialMediaMeta
Vue.prototype.$createBaseMetadata = $createBaseMetadata

const plugin: Plugin = (context) => {
  context.$resolvePostUrl = $resolvePostUrl
  context.$resolveUrl = $resolveUrl
}
export default plugin

declare module 'vue/types/vue' {
  interface Vue {
    $resolvePostUrl: typeof $resolvePostUrl
    $resolveUrl: typeof $resolveUrl
    $setting: Setting
    $createSocialMediaMeta: typeof $createSocialMediaMeta
    $createBaseMetadata: typeof $createBaseMetadata
  }
}

declare module '@nuxt/types' {
  interface Context {
    $payloadURL(route: Route): string
    $resolvePostUrl: typeof $resolvePostUrl
    $resolveUrl: typeof $resolveUrl
  }
}
