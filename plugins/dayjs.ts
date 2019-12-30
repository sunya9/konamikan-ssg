import { Plugin } from '@nuxt/types'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/ja'

dayjs.extend(LocalizedFormat)

const plugin: Plugin = (_, inject) => inject('dayjs', dayjs)

declare module 'vue/types/vue' {
  interface Vue {
    $dayjs: typeof dayjs
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $dayjs: typeof dayjs
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $dayjs: typeof dayjs
  }
}

export default plugin
