import { Context, Plugin } from '@nuxt/types'

const getEnv = (context: Context) => {
  const adminKey: string = context.$config.ADMIN_KEY
  const apiUrl: string = context.env.GHOST_API_URL
  return {
    adminKey,
    apiUrl
  }
}

type EnvType = ReturnType<typeof getEnv>

const plugin: Plugin = (context, inject) => {
  const env = getEnv(context)
  inject('env', env)
}

export default plugin

declare module 'vue/types/vue' {
  interface Vue {
    $env: EnvType
  }
}

declare module '@nuxt/types' {
  interface Context {
    $env: EnvType
  }
}
