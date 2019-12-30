import Vue from 'vue'
import { Setting } from '@tryghost/content-api'
import { Route } from 'vue-router'
import setting from '~/.data/settings.json'
import {
  $resolvePostUrl,
  $createSocialMediaMeta,
  $createBaseMetadata
} from '~/util/util'

Vue.prototype.$resolvePostUrl = $resolvePostUrl
Vue.prototype.$setting = setting.settings
Vue.prototype.$createSocialMediaMeta = $createSocialMediaMeta
Vue.prototype.$createBaseMetadata = $createBaseMetadata

declare module 'vue/types/vue' {
  interface Vue {
    $resolvePostUrl: typeof $resolvePostUrl
    $setting: Setting
    $createSocialMediaMeta: typeof $createSocialMediaMeta
    $createBaseMetadata: typeof $createBaseMetadata
  }
}

declare module '@nuxt/types' {
  interface Context {
    $payloadURL(route: Route): string
  }
}