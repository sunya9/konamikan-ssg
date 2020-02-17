/* eslint-disable no-console */
import { fetchResources } from './scripts/fetchResources'
import { generateRoutes } from './scripts/generateRoutes'
import { fetchAssets } from './scripts/fetchAssets'
import { configuration } from './scripts/configuration'

console.log('configuration', configuration)

async function main() {
  const res = await fetchResources()
  await fetchAssets(res)
  await generateRoutes(res)
}

main()
