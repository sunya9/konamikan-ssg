import { PostOrPage } from '@tryghost/content-api'
import { author } from './author'
import { tag } from './tag'

const createdAt = new Date('2020-04-05 12:34:56')
const updatedAt = new Date('2020-04-05 12:34:56')
const publishedAt = createdAt

export const post: PostOrPage = {
  id: '1',
  slug: 'article',
  uuid: '1',
  comment_id: '',

  title: 'title',
  html: '<p>article</p>',
  plaintext: 'article',
  excerpt: 'excerpt',

  created_at: createdAt.toISOString(),
  updated_at: updatedAt.toISOString(),
  published_at: publishedAt.toISOString(),

  tags: [tag],
  primary_tag: tag,

  authors: [author],
  primary_author: author,

  url: '/article',
  canonical_url: 'https://exmaple.com/article'
}

export const postWithFeatureImage: PostOrPage = {
  ...post,
  id: '2',
  slug: 'article2',
  uuid: '2',
  feature_image: 'feature_image.png',
  canonical_url: 'https://exmaple.com/article2'
}
