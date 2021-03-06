/* eslint-disable no-console */

import * as oldFs from 'fs'
import * as path from 'path'
import * as https from 'https'
import cheerio from 'cheerio'
import { PostOrPage } from '@tryghost/content-api'
import fetch from 'node-fetch'
import { configuration } from './configuration'
import { absolutePathWithoutDomainRegExp, urlPrefixRegExp } from './regexpUtil'
import { Resources } from '~/scripts/fetchResources'

const fs = oldFs.promises

function getCachedDirPath(urlWithoutDomain: string) {
  const relativePath = path.dirname(urlWithoutDomain).substring(1) // remove slash
  const dirPath = path.resolve(configuration.cacheStaticDir, relativePath)
  return dirPath
}

function getCachedFilePath(urlWithoutDomain: string) {
  const filename = path.basename(urlWithoutDomain)
  return path.resolve(getCachedDirPath(urlWithoutDomain), filename)
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

async function excludeCachedFiles(urlWithoutDomains: string[]) {
  const excludeCachedFilesPromise = await Promise.all(
    urlWithoutDomains.map(excludeCachedFile)
  )
  return urlWithoutDomains.filter(
    (_, index) => excludeCachedFilesPromise[index]
  )
}

async function downloadImage(urlWithoutDomain: string): Promise<string> {
  const filePath = getCachedFilePath(urlWithoutDomain)
  console.log('download: ', filePath)
  try {
    const dirPath = path.dirname(filePath)
    await fs.mkdir(dirPath, { recursive: true })
  } catch (e) {
    console.error(e)
  }
  await new Promise<void>((resolve, reject) => {
    const url = `${process.env.GHOST_API_URL!}${urlWithoutDomain}`
    const ws = oldFs.createWriteStream(filePath, { highWaterMark: 1024 * 1024 })
    https.get(url, (res) => res.pipe(ws))
    ws.on('finish', () => resolve())
    ws.on('error', (err) => reject(err))
  })
  return filePath
}

function collectImagesFromPost(post: PostOrPage): string[] {
  if (!post.html) return []
  const $ = cheerio.load(post.html, { decodeEntities: false })
  const postImages: string[] = $('img')
    .filter((_, el) => {
      const src = $(el).attr('src')
      if (!src) return false
      return absolutePathWithoutDomainRegExp.test(src)
    })
    .map((_, e) => $(e).attr('src'))
    .get()
  return postImages
}

async function downloadImages(post: PostOrPage[]): Promise<string[]> {
  const imageUrlsWithoutDomain = post.reduce<string[]>(
    (images, post) => images.concat(collectImagesFromPost(post)),
    []
  )
  const excludeCachedFilesPromise = await Promise.all(
    imageUrlsWithoutDomain.map(excludeCachedFile)
  )
  const downloadPromises = imageUrlsWithoutDomain
    .filter((_, index) => excludeCachedFilesPromise[index])
    .map(downloadImage)
  await downloadPromises.reduce<Promise<any>>(async (a, b) => {
    await a
    return b
  }, Promise.resolve())
  return imageUrlsWithoutDomain.map(getCachedFilePath)
}

function nonNullableUrl(url: string | null | undefined): url is string {
  return !!url
}

async function downloadCovers(resources: Resources) {
  const { posts, authors, tags, settings } = resources
  const res: string[] = []
  const postCoverUrls = posts
    .map((post) => post.feature_image)
    .filter(nonNullableUrl)
  const authorCoverUrls = authors
    .map((author) => author.cover_image)
    .filter(nonNullableUrl)
  const tagCoverUrls = tags
    .map((tag) => tag.feature_image)
    .filter(nonNullableUrl)
  if (settings.cover_image) {
    const coverUrl = settings.cover_image
    res.push(coverUrl)
  }
  res.push(...postCoverUrls, ...authorCoverUrls, ...tagCoverUrls)
  const urlWithoutDomains = res
    .map((url) => url.replace(urlPrefixRegExp, ''))
    .filter((urlWithoutDomain) =>
      absolutePathWithoutDomainRegExp.test(urlWithoutDomain)
    )
  const needDownloadUrls = await excludeCachedFiles(urlWithoutDomains)
  const promises = needDownloadUrls.map(downloadImage)
  await Promise.all(promises)
}

export async function fetchAssets(resources: Resources) {
  const { posts } = resources
  const rssUrl = `${process.env.GHOST_API_URL!}/rss/`
  const rssBody = await fetch(rssUrl).then((res) => res.buffer())
  await fs.writeFile(path.resolve(configuration.staticDir, 'rss.xml'), rssBody)
  const faviconUrl = `${process.env.GHOST_API_URL!}/favicon.png`
  const faviconBody = await fetch(faviconUrl).then((res) => res.buffer())
  await Promise.all([
    fs.writeFile(
      path.resolve(configuration.staticDir, 'icon.png'),
      faviconBody
    ),
    downloadImages(posts),
    downloadCovers(resources)
  ])
}
