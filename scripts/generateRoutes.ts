import { promises as fs } from 'fs'
import * as path from 'path'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { $resolvePostUrl } from '../util/util'
import { configuration } from './configuration'
import { Resources } from '~/types/fetch'
import 'dayjs/locale/ja'

dayjs.extend(LocalizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

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
