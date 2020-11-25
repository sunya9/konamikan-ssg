import { promises as fs } from 'fs'
import * as path from 'path'
import { $resolvePostUrl } from '../util/util'
import { configuration } from './configuration'
import { Resources } from '~/types/fetch'

export function generateRoutes(items: Resources) {
  const postRoutes = items.postObject.posts.map((post) => {
    if (!post.url) return ''
    return $resolvePostUrl(post)
  })
  const tagRoutes = items.tagsObject.tags.map((tag) => `/tag/${tag.slug}`)
  // const pageRoutes = items.pages.pages.map((page) => `/page/${page.slug}`)
  const authorRoutes = items.authorsObject.authors.map(
    (author) => `/author/${author.slug}`
  )
  const routes = [...postRoutes, ...tagRoutes, ...authorRoutes]
  const routesStr = JSON.stringify(routes)
  return fs.writeFile(
    path.resolve(configuration.dataDir, `routes.json`),
    routesStr,
    {
      encoding: 'utf8'
    }
  )
}
