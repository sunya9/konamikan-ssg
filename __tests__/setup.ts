import { config, RouterLinkStub } from '@vue/test-utils'
import { PostOrPage } from '@tryghost/content-api'
import Vue from 'vue'
import dayjs from 'dayjs'
import { $setting } from './fixtures/setting'

// environemnt variables
process.env.APP_ID = 'TEST'
process.env.SEARCH_KEY = 'TEST'

config.stubs = {
  'nuxt-link': RouterLinkStub
}

Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true })

const resolveUrl = (url?: string) => url || ''
const getId = (id?: string) => `__test__${id}`
Vue.use({
  install(Vue) {
    Vue.prototype.$setting = $setting
    Vue.prototype.$dayjs = dayjs
    Vue.prototype.$resolveUrl = resolveUrl
    Vue.prototype.$id = getId
    Vue.prototype.$resolvePostUrl = (post?: Pick<PostOrPage, 'url'>) =>
      resolveUrl(post?.url)
  }
})
