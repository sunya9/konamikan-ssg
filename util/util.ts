import { PostOrPage, SocialMedia, Metadata } from '@tryghost/content-api'

export function $resolvePostUrl(post: Pick<PostOrPage, 'url'>) {
  return post.url?.replace(process.env.URL!, '') || ''
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

export function $createSocialMediaMeta(socialMedia: SocialMedia) {
  const res: object[] = []
  if (socialMedia.og_description) {
    res.push({
      hid: 'og:description',
      property: 'og:description',
      content: socialMedia.og_description
    })
  }
  if (socialMedia.og_image) {
    res.push({
      hid: 'og:image',
      property: 'og:image',
      content: socialMedia.og_image
    })
  }
  if (socialMedia.og_title) {
    res.push({
      hid: 'og:title',
      property: 'og:title',
      content: socialMedia.og_title
    })
  }
  if (socialMedia.twitter_description) {
    res.push({
      hid: 'twitter:description',
      property: 'twitter:description',
      content: socialMedia.twitter_description
    })
  }
  if (socialMedia.twitter_image) {
    res.push({ name: 'twitter:card', content: 'summary_large_image' })
    res.push({
      hid: 'twitter:image',
      property: 'twitter:image',
      content: socialMedia.twitter_image
    })
  }

  if (socialMedia.twitter_title) {
    res.push({
      hid: 'twitter:title',
      property: 'twitter:title',
      content: socialMedia.twitter_title
    })
  }
  return res
}

export interface PostOrPageLight {
  id: string
  title: string
  excerpt: string
  // eslint-disable-next-line camelcase
  published_at: string
  url: string
}

export function reducePostFieldMapper(post: PostOrPage): PostOrPageLight {
  return {
    id: post.id,
    title: post.title || '',
    excerpt: post.custom_excerpt || post.excerpt || '',
    published_at: post.published_at || '',
    url: post.url || ''
  }
}
