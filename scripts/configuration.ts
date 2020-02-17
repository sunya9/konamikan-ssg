import * as path from 'path'

const { NETLIFY_BUILD_BASE } = process.env

const root = path.resolve(__dirname, '../')

const cacheDir = NETLIFY_BUILD_BASE
  ? path.resolve(NETLIFY_BUILD_BASE, 'cache', 'private')
  : root

export const configuration = {
  dataDir: path.resolve(root, '.data'),
  staticDir: path.resolve(root, 'static'),
  cacheStaticDir: path.resolve(cacheDir, 'static')
} as const
