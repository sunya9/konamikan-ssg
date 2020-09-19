import { ServerMiddleware } from '@nuxt/types'
import Fuse from 'fuse.js'
import posts from '../.data/posts.json'
import tags from '../.data/tags.json'
import authors from '../.data/authors.json'
import { FuseItem } from '~/entity/fuseItem'

const list: FuseItem[] = [
  ...posts.posts.map<FuseItem>((post) => ({
    title: post.title,
    content: post.plaintext,
    url: post.url,
    type: 'post'
  })),
  ...tags.tags.map<FuseItem>((tag) => ({
    title: tag.name,
    content: tag.description || '',
    url: tag.url,
    type: 'tag'
  })),
  ...authors.authors.map<FuseItem>((author) => ({
    title: author.name,
    content: author.bio,
    url: author.url,
    type: 'author'
  }))
]
const fuse = new Fuse(list, {
  includeMatches: true,
  shouldSort: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: ['title', 'content']
})

const middleware: ServerMiddleware = (req, res) => {
  if (!req.originalUrl) throw new Error('url not found')
  const url = new URL(`http://localhost${req.originalUrl}`)
  const q = url.searchParams.get('q')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(search(q)))
}

function search(q?: string | null) {
  if (!q) return []
  const searchResult = fuse.search(q, {
    limit: 5
  })
  return searchResult
}

export default middleware
