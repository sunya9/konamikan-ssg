import * as path from 'path'

import { writeFile } from 'fs-extra'
import { post } from '../__tests__/fixtures/postOrPage'
import { tag } from '../__tests__/fixtures/tag'
import { author } from '../__tests__/fixtures/author'
import { $setting } from '../__tests__/fixtures/setting'

const routes = [] as const

const dataDir = path.resolve(__dirname, '../.data')

const files = [
  { name: 'authors.json', data: { authors: [author] } },
  { name: 'routes.json', data: routes },
  { name: 'posts.json', data: { posts: [post] } },
  { name: 'tags.json', data: { tags: [tag] } },
  { name: 'settings.json', data: { settings: $setting } }
]

async function main() {
  const promises = files.map((fileInfo) =>
    writeFile(
      path.resolve(dataDir, fileInfo.name),
      JSON.stringify(fileInfo.data)
    )
  )

  await Promise.all(promises)
  console.log('complete')
}

main()
