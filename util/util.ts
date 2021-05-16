import { PostOrPage, Metadata } from '@tryghost/content-api'
import * as cheerio from 'cheerio'
import { urlPrefixRegExp, httpRegExp } from '../scripts/regexpUtil'

export function $resolvePostUrl(post: Pick<PostOrPage, 'slug'>) {
  return `/blog/${post.slug}`
}

export function $resolveUrl(url: string | null | undefined): string {
  return url?.replace(process.env.URL!, '') || ''
}

export function $replaceHostWithOriginal(
  url: string | null | undefined
): string {
  return url?.replace(process.env.URL!, process.env.API_URL!) || ''
}

export function $createBaseMetadata(metadata: Metadata) {
  const res: object[] = []
  if (metadata.meta_description) {
    res.push({
      hid: 'description',
      property: 'description',
      content: metadata.meta_description
    })
  }
  return res
}

export function $createSocialMediaMeta(post: PostOrPage) {
  const res: object[] = []
  const excerpt = post.custom_excerpt || post.excerpt
  res.push({
    hid: 'og:description',
    property: 'og:description',
    content: post.og_description || excerpt
  })
  res.push({
    hid: 'twitter:description',
    property: 'twitter:description',
    content: post.twitter_description || excerpt
  })
  res.push({
    hid: 'og:image',
    property: 'og:image',
    content: post.og_image || post.feature_image
  })
  res.push({ name: 'twitter:card', content: 'summary_large_image' })
  res.push({
    hid: 'twitter:image',
    property: 'twitter:image',
    content: post.twitter_image || post.feature_image
  })
  res.push({
    hid: 'og:title',
    property: 'og:title',
    content: post.og_title || post.title
  })
  res.push({
    hid: 'twitter:title',
    property: 'twitter:title',
    content: post.twitter_title || post.title
  })

  return res
}

export interface PostOrPageLight {
  id: string
  title: string
  excerpt: string
  // eslint-disable-next-line camelcase
  published_at: string
  url: string
  // eslint-disable-next-line camelcase
  feature_image: string
  slug: string
}

export function reducePostFieldMapper(post: PostOrPage): PostOrPageLight {
  return {
    id: post.id,
    title: post.title || '',
    excerpt: post.custom_excerpt || post.excerpt || '',
    published_at: post.published_at || '',
    url: post.url || '',
    feature_image: post.feature_image || '',
    slug: post.slug
  }
}

function normalizeSrc($: cheerio.CheerioAPI) {
  $('iframe,img').each((_, e) => {
    const currentSrc = $(e).attr('src')
    if (!currentSrc) return
    // replace http:// scheme with '//'
    const newSrc = currentSrc.replace(httpRegExp, '//')
    $(e).attr('src', newSrc)
  })
}

function addClasses($: cheerio.CheerioAPI) {
  $('.kg-bookmark-card').addClass('box')
  $('.kg-bookmark-container').addClass('media has-text-dark')
  $('.kg-bookmark-title').addClass('has-text-weight-medium')
  $('.kg-bookmark-content').addClass('media-content has-text-left')
  $('.kg-bookmark-thumbnail').addClass('media-left')
}

function replaceImgSrcHost($: cheerio.CheerioAPI, preview: boolean) {
  // if preview mode, keep ghost raw url. If not, remove own host part
  const replaceValue = preview ? process.env.GHOST_API_URL! : ''
  $('img').each((_, e) => {
    const newSrc = $(e)
      .attr('src')
      ?.replace(urlPrefixRegExp, replaceValue)
    if (!newSrc) return
    $(e).attr('src', newSrc)
  })
}

function removeSrcSet($: cheerio.CheerioAPI) {
  $('img').each((_, e) => {
    $(e).removeAttr('srcset')
    $(e).removeAttr('sizes')
    $(e).removeAttr('width')
    $(e).removeAttr('height')
  })
}

export function fixPostOrPage(
  post: PostOrPage,
  preview: boolean = false
): PostOrPage {
  if (!post.html) return post
  const $ = cheerio.load(post.html, {
    decodeEntities: false
  })
  addClasses($)
  normalizeSrc($)
  removeSrcSet($)
  replaceImgSrcHost($, preview)
  const html = $.html()
  return {
    ...post,
    html
  }
}
