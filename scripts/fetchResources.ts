import { promises as fs } from 'fs'
import * as path from 'path'
import * as cheerio from 'cheerio'
import GhostContentAPI, {
  Author,
  PostOrPage,
  PostsOrPages,
  Settings,
  Tag
} from '@tryghost/content-api'
import { configuration } from './configuration'
import { urlPrefixRegExp, httpRegExp } from './regexpUtil'

export interface Resources {
  posts: PostOrPage[]
  tags: Tag[]
  pages: PostOrPage[]
  authors: Author[]
  settings: Settings
}

function getTargetImgList($: cheerio.Selector): cheerio.Cheerio {
  return $('img').filter((_, e) => {
    const src = $(e).attr('src')
    if (!src) return false
    return urlPrefixRegExp.test(src)
  })
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

function normalizeSrc(src: string | undefined): string {
  if (!src) return ''
  if (httpRegExp.test(src)) {
    return src.replace(httpRegExp, '//') || ''
  }
  // remove own host part
  if (urlPrefixRegExp.test(src)) {
    return src.replace(urlPrefixRegExp, '')
  }
  return src
}

function addClasses($: cheerio.Selector) {
  $('.kg-bookmark-card').addClass('box')
  $('.kg-bookmark-container').addClass('media has-text-dark')
  $('.kg-bookmark-content').addClass('media-content')
  $('.kg-bookmark-thumbnail').addClass('media-left')
  $('iframe,img').each((_, e) => {
    const currentSrc = $(e).attr('src')
    const newSrc = normalizeSrc(currentSrc)
    $(e).attr('src', newSrc)
  })
}

function fixPostOrPage(post: PostOrPage): PostOrPage {
  if (!post.html) return post
  const $ = cheerio.load(post.html, {
    decodeEntities: false,
    _useHtmlParser2: true
  })
  addClasses($)
  getTargetImgList($).each((_, e) => {
    const newSrc = $(e)
      .attr('src')
      ?.replace(urlPrefixRegExp, '')
    if (!newSrc) return
    $(e).attr('src', newSrc)
  })
  const html = $.html()
  return {
    ...post,
    html
  }
}

function fixPostsOrPages(posts: PostsOrPages): PostOrPage[] {
  return posts.map(fixPostOrPage)
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
