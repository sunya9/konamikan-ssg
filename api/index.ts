import express from 'express'
import posts from '../.data/posts.json'
import pages from '../.data/pages.json'
import tags from '../.data/tags.json'
import authors from '../.data/authors.json'

const app = express()
const ghost: {
  [key: string]: any
} = {
  posts,
  pages,
  tags,
  authors
}

app.get('/:resource', (req, res) => {
  if (!req.url) return
  const { resource } = req.params
  const items = ghost[resource]
  if (!items) return
  // res.
  res.json(items)
})

export default {
  path: '/api',
  handler: app
}
