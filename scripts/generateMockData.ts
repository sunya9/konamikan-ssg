import * as path from 'path'

import { writeFile, mkdirp } from 'fs-extra'
import { post } from '../__tests__/fixtures/postOrPage'
import { tag } from '../__tests__/fixtures/tag'
import { author } from '../__tests__/fixtures/author'
import { $settings } from '../__tests__/fixtures/settings'

const routes = [] as const

const dataDir = path.resolve(__dirname, '../.data')

const files = [
  { name: 'routes.json', data: routes },
  { name: 'authors.json', data: [author] },
  { name: 'posts.json', data: [post] },
  { name: 'pages.json', data: [post] },
  { name: 'tags.json', data: [tag] },
  { name: 'settings.json', data: $settings }
]

async function main() {
  await mkdirp(dataDir)
  const promises = files.map((fileInfo) =>
    writeFile(
      path.resolve(dataDir, fileInfo.name),
      JSON.stringify(fileInfo.data)
    )
  )

  await Promise.all(promises)
  // eslint-disable-next-line no-console
  console.log('complete')
}

main()
