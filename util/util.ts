import { PostOrPage, Metadata } from '@tryghost/content-api'

export function $resolvePostUrl(post: Pick<PostOrPage, 'url'>) {
  return $resolveUrl(post.url)
}

export function $resolveUrl(url: string | null | undefined): string {
  return url?.replace(process.env.URL!, '') || ''
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
}

export function reducePostFieldMapper(post: PostOrPage): PostOrPageLight {
  return {
    id: post.id,
    title: post.title || '',
    excerpt: post.custom_excerpt || post.excerpt || '',
    published_at: post.published_at || '',
    url: post.url || '',
    feature_image: post.feature_image || ''
  }
}
