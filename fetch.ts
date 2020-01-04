/* eslint-disable no-console */
import * as oldFs from 'fs'
import { resolve, basename, dirname } from 'path'
import * as https from 'https'
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
import * as fse from 'fs-extra'
import escapeStringRegexp from 'escape-string-regexp'
import { $resolvePostUrl } from './util/util'

const { NETLIFY_BUILD_BASE } = process.env
const fs = oldFs.promises
const dataDir = resolve(__dirname, '.data')
const staticDir = resolve(__dirname, 'static')
const cacheDir = NETLIFY_BUILD_BASE
  ? resolve(NETLIFY_BUILD_BASE, 'cache', 'private')
  : __dirname
const cacheStaticDir = resolve(cacheDir, 'static')

const onNetlify = 'NETLIFY' in process.env

console.log('dataDir', dataDir)
console.log('staticDir', staticDir)
console.log('cacheDir', cacheDir)
console.log('cacheStaticDir', cacheStaticDir)

const contentPathPrefix = escapeStringRegexp(`${process.env.URL!}`)
const urlPrefixRegExp = new RegExp(`^${contentPathPrefix}`)

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

function getTargetImgList($: CheerioStatic): Cheerio {
  return $('img').filter((_, e) => {
    const src = $(e).attr('src')
    if (!src) return false
    return urlPrefixRegExp.test(src)
  })
}

const httpRegExp = /^http:\/\//
const absolutePathWithoutDomainRegExp = /^\/[^/]/

function normalizeSrc(src: string | undefined): string {
  if (!src) return ''
  if (httpRegExp.test(src)) {
    return src.replace(httpRegExp, '//') || ''
  }
  if (absolutePathWithoutDomainRegExp.test(src)) {
    return `${process.env.URL!}${src}`
  }
  return src
}

function fixPostOrPage(post: PostOrPage): PostOrPage {
  if (!post.html) return post
  const $ = cheerio.load(post.html, { decodeEntities: false })
  $('.kg-bookmark-card').addClass('box')
  $('.kg-bookmark-container').addClass('media has-text-dark')
  $('.kg-bookmark-content').addClass('media-content')
  $('.kg-bookmark-thumbnail').addClass('media-left')
  $('iframe,img').each((_, e) => {
    const currentSrc = $(e).attr('src')
    const newSrc = normalizeSrc(currentSrc)
    $(e).attr('src', newSrc)
  })
  getTargetImgList($).each((_, e) => {
    const newSrc = $(e)
      .attr('src')
      ?.replace(urlPrefixRegExp, '')
    if (!newSrc) return
    $(e).attr('src', newSrc)
  })
  if (post.feature_image && urlPrefixRegExp.test(post.feature_image)) {
    post.feature_image = post.feature_image?.replace(urlPrefixRegExp, '')
  }
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

function getCachedDirPath(urlWithoutDomain: string) {
  const relativePath = dirname(urlWithoutDomain).substring(1) // remove slash
  const dirPath = resolve(cacheStaticDir, relativePath)
  return dirPath
}

function getCachedFilePath(urlWithoutDomain: string) {
  const filename = basename(urlWithoutDomain)
  return resolve(getCachedDirPath(urlWithoutDomain), filename)
}

async function excludeCachedFile(urlWithoutDomain: string) {
  try {
    const cachedFilePath = getCachedFilePath(urlWithoutDomain)
    await fs.access(cachedFilePath)
    return false
  } catch (e) {
    return true
  }
}

async function downloadImage(urlWithoutDomain: string): Promise<string> {
  const filePath = getCachedFilePath(urlWithoutDomain)
  console.log('download: ', filePath)
  try {
    const dirPath = dirname(filePath)
    await fs.mkdir(dirPath, { recursive: true })
  } catch (e) {}
  await new Promise<never>((resolve, reject) => {
    const url = `${process.env.URL!}${urlWithoutDomain}`
    const ws = oldFs.createWriteStream(filePath)
    const stream = https.get(url, (res) => res.pipe(ws))
    stream.on('finish', () => resolve())
    stream.on('error', (err) => reject(err))
  })
  return filePath
}

async function downloadImages(post: PostObject): Promise<string[]> {
  const imageUrlsWithoutDomain = post.posts.reduce<string[]>((images, post) => {
    if (!post.html) return images
    const $ = cheerio.load(post.html, { decodeEntities: false })
    const postImages = $('img')
      .filter((_, el) => {
        const src = $(el).attr('src')
        if (!src) return false
        return absolutePathWithoutDomainRegExp.test(src)
      })
      .map((_, e) => $(e).attr('src'))
      .get()
    if (
      post.feature_image &&
      absolutePathWithoutDomainRegExp.test(post.feature_image)
    ) {
      postImages.push(post.feature_image)
    }
    return images.concat(postImages).concat()
  }, [])
  const excludeCachedFilesPromise = await Promise.all(
    imageUrlsWithoutDomain.map(excludeCachedFile)
  )
  const downloadPromises = imageUrlsWithoutDomain
    .filter((_, index) => excludeCachedFilesPromise[index])
    .map(downloadImage)
  await Promise.all(downloadPromises)
  return imageUrlsWithoutDomain.map(getCachedFilePath)
}

async function downloadStaticFiles(postObject: PostObject, setting: Setting) {
  const staticDir = resolve(__dirname, 'static')
  const rssUrl = `${process.env.URL!}/rss/`
  const rssBody = await fetch(rssUrl).then((res) => res.buffer())
  await fs.writeFile(resolve(staticDir, 'rss.xml'), rssBody)
  const faviconUrl = setting.icon!
  const faviconBody = await fetch(faviconUrl).then((res) => res.buffer())
  await fs.writeFile(resolve(staticDir, 'icon.png'), faviconBody)
  await downloadImages(postObject)
  if (onNetlify) {
    await fse.copy(cacheStaticDir, staticDir, { recursive: true })
  }
}

async function main() {
  const res = await generateFiles()
  const items = {
    posts: res.posts,
    tags: res.tags,
    pages: res.pages,
    authors: res.authors
  }
  await downloadStaticFiles(items.posts, res.settings.settings)
  await generateRoutes(items)
}

main()
