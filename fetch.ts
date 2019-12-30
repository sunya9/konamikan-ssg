import { promises as fs } from 'fs'
import { resolve } from 'path'
import fetch from 'node-fetch'
import {
  PostObject,
  TagsObject,
  AuthorsObject,
  PagesObject,
  SettingsObject
} from '@tryghost/content-api'
import { $resolvePostUrl } from './util/util'

const dataDir = resolve(__dirname, '.data')

function write<T>(resource: string) {
  return async (body: T) => {
    const json = JSON.stringify(body)
    await fs.writeFile(resolve(dataDir, `${resource}.json`), json, {
      encoding: 'utf8'
    })
    return body
  }
}

async function request<T>(
  resource: string,
  query: { [key: string]: Array<string> | string } = {}
): Promise<T> {
  const queryStr = Object.entries(query)
    .map(([key, val]) => {
      const normalizedVal = typeof val === 'string' ? val : val.join(',')
      return `${key}=${normalizedVal}`
    }, {})
    .join('&')
  const res = await fetch(
    `${process.env.URL}/ghost/api/v3/content/${resource}?${queryStr}&key=${process.env.KEY}&formats=html`
  )
  return res.json()
}

async function generateFiles() {
  await fs.mkdir(dataDir).catch(() => {})
  try {
    const [posts, tags, pages, authors, settings] = await Promise.all([
      request<PostObject>('posts', {
        limit: 'all',
        include: ['tags', 'authors']
      }).then(write('posts')),
      request<TagsObject>('tags', { limit: 'all' }).then(write('tags')),
      request<PagesObject>('pages', { limit: 'all' }).then(write('pages')),
      request<AuthorsObject>('authors', { limit: 'all' }).then(
        write('authors')
      ),
      request<SettingsObject>('settings').then(write('settings'))
    ])
    return {
      posts,
      tags,
      pages,
      authors,
      settings
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

function generateRoutes(items: {
  posts: PostObject
  tags: TagsObject
  pages: PagesObject
  authors: AuthorsObject
}) {
  const postRoutes = items.posts.posts.map((post) => `${$resolvePostUrl(post)}`)
  const tagRoutes = items.tags.tags.map((tag) => `/tag/${tag.slug}`)
  // const pageRoutes = items.pages.pages.map((page) => `/page/${page.slug}`)
  const authorRoutes = items.authors.authors.map(
    (author) => `/author/${author.slug}`
  )
  const routes = [...postRoutes, ...tagRoutes, ...authorRoutes]
  const routesStr = JSON.stringify(routes)
  return fs.writeFile(resolve(dataDir, `routes.json`), routesStr, {
    encoding: 'utf8'
  })
}

async function main() {
  const res = await generateFiles()
  if (!res) return
  const items = {
    posts: res.posts,
    tags: res.tags,
    pages: res.pages,
    authors: res.authors
  }
  await generateRoutes(items)
}

main()
