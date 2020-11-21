interface BaseFuseItem {
  title: string
  content: string
  url: string
  slug: string
}

export type FuseItem = BaseFuseItem &
  (
    | {
        type: 'post'
        published_at: string
      }
    | { type: 'page' }
    | { type: 'author' }
    | { type: 'tag' }
  )
