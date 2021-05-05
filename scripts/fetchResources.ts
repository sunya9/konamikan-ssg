import { promises as fs } from 'fs'
import * as path from 'path'
import GhostContentAPI, {
  Author,
  PostOrPage,
  PostsOrPages,
  Settings,
  Tag
} from '@tryghost/content-api'
import { fixPostOrPage } from '../util/util'
import { configuration } from './configuration'

export interface Resources {
  posts: PostOrPage[]
  tags: Tag[]
  pages: PostOrPage[]
  authors: Author[]
  settings: Settings
}

function write<T>(resource: string) {
  return async (body: T) => {
    const json = JSON.stringify(body)
    await fs.writeFile(
      path.resolve(configuration.dataDir, `${resource}.json`),
      json,
      {
        encoding: 'utf8'
      }
    )
    return body
  }
}

const client = GhostContentAPI({
  key: process.env.KEY || '',
  url: process.env.GHOST_API_URL || '',
  version: 'v3'
})

export function fixPostsOrPages(posts: PostsOrPages): PostOrPage[] {
  return posts.map((postOrPages) => fixPostOrPage(postOrPages, false))
}

export async function fetchResources(): Promise<Resources> {
  await Promise.all([
    fs.mkdir(configuration.dataDir).catch(() => {}),
    fs.mkdir(configuration.staticDir).catch(() => {}),
    fs.mkdir(configuration.cacheStaticDir).catch(() => {})
  ])
  const [posts, tags, pages, authors, settings] = await Promise.all([
    client.posts
      .browse({
        limit: 'all',
        formats: ['html', 'plaintext'],
        include: ['tags', 'authors']
      })
      .then(fixPostsOrPages)
      .then(write('posts')),
    client.tags.browse({ limit: 'all' }).then(write('tags')),
    client.pages.browse({ limit: 'all' }).then(write('pages')),
    client.authors.browse({ limit: 'all' }).then(write('authors')),
    client.settings.browse().then(write('settings'))
  ])
  return {
    posts,
    tags,
    pages,
    authors,
    settings
  }
}
