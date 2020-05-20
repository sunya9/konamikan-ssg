import { promises as fs } from 'fs'
import * as path from 'path'
import cheerio from 'cheerio'
import {
  PostObject,
  TagsObject,
  AuthorsObject,
  PagesObject,
  SettingsObject,
  PostOrPage
} from '@tryghost/content-api'
import fetch from 'node-fetch'
import { configuration } from './configuration'
import { urlPrefixRegExp, httpRegExp } from './regexpUtil'
import { Resources } from '~/types/fetch'

function getTargetImgList($: CheerioStatic): Cheerio {
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
    `${process.env.GHOST_API_URL}/ghost/api/v3/content/${resource}?${queryStr}&key=${process.env.KEY}&formats=html`
  )
  return res.json()
}

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

function addClasses($: CheerioStatic) {
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

function fixPostObject(postObject: PostObject): PostObject {
  return {
    ...postObject,
    posts: postObject.posts.map(fixPostOrPage)
  }
}

export async function fetchResources(): Promise<Resources> {
  await fs.mkdir(configuration.dataDir).catch(() => {})
  const [
    postObject,
    tagsObject,
    pagesObject,
    authorsObject,
    settingsObject
  ] = await Promise.all([
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
    postObject,
    tagsObject,
    pagesObject,
    authorsObject,
    settingsObject
  }
}
