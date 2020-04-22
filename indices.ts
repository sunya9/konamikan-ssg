import algoliasearch from 'algoliasearch'
import { PostOrPage, Tag, Author } from '@tryghost/content-api'
import posts from './.data/posts.json'
import tags from './.data/tags.json'
import authors from './.data/authors.json'
import pages from './.data/pages.json'

const client = algoliasearch(process.env.APP_ID!, process.env.ADMIN_KEY!)
const index = client.initIndex(process.env.ALGOLIA_INDEX || 'private')

async function saveObjects() {
  await index.clearObjects()
  await Promise.all([
    index.saveObjects(
      (posts.posts as PostOrPage[]).map((post: PostOrPage) => ({
        name: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        custom_excerpt: post.custom_excerpt,
        url: post.url,
        type: 'post',
        objectID: `post-${post.id}`
      }))
    ),
    index.saveObjects(
      (tags.tags as Tag[]).map((tag) => ({
        name: tag.name,
        description: tag.description,
        slug: tag.slug,
        type: 'tag',
        objectID: `tag-${tag.id}`
      }))
    ),
    index.saveObjects(
      (pages.pages as PostOrPage[]).map((page) => ({
        name: page.title,
        slug: page.slug,
        excerpt: page.excerpt,
        custom_excerpt: page.custom_excerpt,
        type: 'page',
        objectID: `page-${page.id}`
      }))
    ),
    index.saveObjects(
      (authors.authors as Author[]).map((author) => ({
        slug: author.slug,
        name: author.name,
        bio: author.bio,
        location: author.location,
        website: author.website,
        twitter: author.twitter,
        facebook: author.facebook,
        type: 'author',
        objectID: `author-${author.id}`
      }))
    )
  ])
}

function main() {
  // eslint-disable-next-line no-console
  saveObjects().catch((e) => console.error(e))
}

main()
