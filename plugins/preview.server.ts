import { Plugin } from '@nuxt/types'
import GhostAdminAPI from '@tryghost/admin-api'
import { fixPostOrPage } from '~/util/util'

const buildPreviewFunc = (client: GhostAdminAPI) => {
  return async (id: string) => {
    const post = await client.posts.read(
      { id },
      {
        formats: 'html'
      }
    )
    return fixPostOrPage(post, true)
  }
}

type PreviewFunc = ReturnType<typeof buildPreviewFunc>

const plugin: Plugin = (context) => {
  const $env = context.$env
  const client = new GhostAdminAPI({
    key: $env.adminKey,
    version: 'v3',
    url: $env.apiUrl
  })
  const preview = buildPreviewFunc(client)
  context.preview = preview
}

export default plugin

declare module '@nuxt/types' {
  interface Context {
    preview: PreviewFunc
  }
}
