declare module '~/.data/posts.json' {
  import { PostsOrPages } from '@tryghost/content-api'
  const value: PostsOrPages
  export default value
}
