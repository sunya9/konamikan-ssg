import { ServerMiddleware } from '@nuxt/types'
import posts from '../../.data/posts.json'
import pages from '../../.data/pages.json'
import tags from '../../.data/tags.json'
import authors from '../../.data/authors.json'

const ghost: Record<string, object> = {
  posts,
  pages,
  tags,
  authors
}

const serverMiddleware: ServerMiddleware = (req, res) => {
  // nuxt: e.g. req.url === '/posts'
  // nuxt with now: e.g. req.url === '/api/resource/posts?resource=posts'
  const url = new URL(`localhost:3000${req.url}`)
  const resource = url.pathname.split('/').pop()
  if (!resource) return
  const items = ghost[resource]
  if (!items) return
  res.setHeader('Content-Type', 'application/json;charset=utf-8')
  res.end(JSON.stringify(items))
}

export default serverMiddleware
