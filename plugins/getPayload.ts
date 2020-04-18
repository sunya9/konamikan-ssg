import { Route } from 'vue-router'
import { Plugin } from '@nuxt/types'

const plugin: Plugin = (context) => {
  const cache: {
    [key: string]: object
  } = {}
  const getPayload = async (callback: () => Promise<object> | object) => {
    if (!process.static || !process.client || !context.$payloadURL)
      return callback()
    const url = context.$payloadURL(context.route)
    if (cache[url]) return cache[url]
    const res: object = await fetch(url).then((res) => res.json())
    cache[url] = res
    return res
  }
  context.getPayload = getPayload
}

declare module '@nuxt/types' {
  interface Context {
    $payloadURL(route: Route): string
    getPayload(callback: () => Promise<object> | object | void): Promise<object>
  }
}

export default plugin
