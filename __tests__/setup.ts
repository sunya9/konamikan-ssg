import { config, RouterLinkStub } from '@vue/test-utils'
import { PostOrPage } from '@tryghost/content-api'
import Vue from 'vue'
import dayjs from 'dayjs'
import { $settings } from './fixtures/settings'

config.stubs = {
  'nuxt-link': RouterLinkStub,
  ClientOnly: {
    functional: true,
    render: (h, context) => h('div', context.data, context.children)
  }
}

Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true })

const resolveUrl = (url?: string) => url || ''
const getId = (id?: string) => `__test__${id}`
Vue.use({
  install(Vue) {
    Vue.prototype.$settings = $settings
    Vue.prototype.$dayjs = dayjs
    Vue.prototype.$resolveUrl = resolveUrl
    Vue.prototype.$id = getId
    Vue.prototype.$resolvePostUrl = (post?: Pick<PostOrPage, 'url'>) =>
      resolveUrl(post?.url)
  }
})
