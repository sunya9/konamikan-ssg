import { promises as fs } from 'fs'
import { resolve } from 'path'
import fetch from 'node-fetch'
import {
  PostObject,
  TagsObject,
  AuthorsObject,
  PagesObject,
  SettingsObject,
  Setting,
  PostOrPage
} from '@tryghost/content-api'
import cheerio from 'cheerio'
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

function fixPostOrPage(post: PostOrPage): PostOrPage {
  if (!post.html) return post
  const $ = cheerio.load(post.html, { decodeEntities: false })
  $('.kg-bookmark-card').addClass('box')
  $('.kg-bookmark-container').addClass('media has-text-dark')
  $('.kg-bookmark-content').addClass('media-content')
  $('.kg-bookmark-thumbnail').addClass('media-left')
  $('iframe,img').each((_, e) => {
    const newSrc = $(e)
      .attr('src')
      ?.replace('http://', '//')
    if (!newSrc) return
    $(e).attr('src', newSrc)
  })
  const html = $.html()
  return {
    ...post,
    html
  }
}

function fixPostObject(postObject: PostObject): PostObject {
  return {
    ...postObject,
    posts: postObject.posts.map(fixPostOrPage)
  }
}

async function generateFiles() {
  await fs.mkdir(dataDir).catch(() => {})
  const [posts, tags, pages, authors, settings] = await Promise.all([
    request<PostObject>('posts', {
      limit: 'all',
      include: ['tags', 'authors']
    })
      .then(fixPostObject)
      .then(write('posts')),
    request<TagsObject>('tags', { limit: 'all' }).then(write('tags')),
    request<PagesObject>('pages', { limit: 'all' }).then(write('pages')),
    request<AuthorsObject>('authors', { limit: 'all' }).then(write('authors')),
    request<SettingsObject>('settings').then(write('settings'))
  ])
  return {
    posts,
    tags,
    pages,
    authors,
    settings
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

async function downloadStaticFiles(setting: Setting) {
  const staticDir = resolve(__dirname, 'static')
  const rssUrl = `${process.env.URL!}/rss/`
  const rssBody = await fetch(rssUrl).then((res) => res.buffer())
  await fs.writeFile(resolve(staticDir, 'rss.xml'), rssBody)
  const faviconUrl = setting.icon!
  const faviconBody = await fetch(faviconUrl).then((res) => res.buffer())
  await fs.writeFile(resolve(staticDir, 'icon.png'), faviconBody)
}

async function main() {
  const res = await generateFiles()
  const items = {
    posts: res.posts,
    tags: res.tags,
    pages: res.pages,
    authors: res.authors
  }
  await downloadStaticFiles(res.settings.settings)
  await generateRoutes(items)
}

main()
