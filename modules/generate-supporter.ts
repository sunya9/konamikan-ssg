import * as http from 'http'
import { Module } from '@nuxt/types'
import express from 'express'
import api from '../api'

const buildModule: Module<never> = function() {
  if (!this.nuxt.options.dev) {
    let server: http.Server
    this.nuxt.hook('export:before', async () => {
      const app = express()
      app.use('/api', api.handler)
      await new Promise((resolve) => {
        server = app.listen(3000, (err) => {
          // eslint-disable-next-line no-console
          if (err) console.error(err)
          resolve()
        })
      })
    })
    this.nuxt.hook('generate:done', () => server?.close())
  } else {
    // add server middleware dynamically because contents of ../api is overwritten when set in nuxt.config.ts directly
    this.addServerMiddleware('~/api/index.ts')
  }
}

export default buildModule
