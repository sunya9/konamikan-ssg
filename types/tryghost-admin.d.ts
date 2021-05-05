declare module '@tryghost/admin-api' {
  import {
    GhostContentAPIOptions,
    Params,
    PostOrPage
  } from '@tryghost/content-api'

  export default class GhostAdminAPI {
    constructor(options: {
      url: string
      version: GhostContentAPIOptions['version']
      key: string
    })

    posts: {
      read(data: { id: string }, options?: Params): Promise<PostOrPage>
    }
  }
}
