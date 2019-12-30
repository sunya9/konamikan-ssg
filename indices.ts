import algoliasearch from 'algoliasearch'
import { PostOrPage, Tag, Author } from '@tryghost/content-api'
import posts from './.data/posts.json'
import tags from './.data/tags.json'
import authors from './.data/authors.json'
import pages from './.data/pages.json'

const client = algoliasearch(process.env.APP_ID!, process.env.ADMIN_KEY!)
const index = client.initIndex('private')

async function main() {
  await index.clearIndex()
  await Promise.all([
    index.addObjects(
      (posts.posts as PostOrPage[]).map((post: PostOrPage) => ({
        name: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        custom_excerpt: post.custom_excerpt,
        published_at: post.published_at,
        type: 'post'
      }))
    ),
    index.addObjects(
      (tags.tags as Tag[]).map((tag) => ({
        name: tag.name,
        description: tag.description,
        slug: tag.slug,
        type: 'tag'
      }))
    ),
    index.addObjects(
      (pages.pages as PostOrPage[]).map((post) => ({
        name: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        custom_excerpt: post.custom_excerpt,
        type: 'page'
      }))
    ),
    index.addObjects(
      (authors.authors as Author[]).map((author) => ({
        slug: author.slug,
        name: author.name,
        bio: author.bio,
        location: author.location,
        website: author.website,
        twitter: author.twitter,
        facebook: author.facebook,
        type: 'author'
      }))
    )
  ])
}

main()
