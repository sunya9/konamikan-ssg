import * as http from 'http'
import { Module } from '@nuxt/types'
import express from 'express'
import api from '../api/resources/[resource]'

const buildModule: Module<never> = function() {
  if (!this.nuxt.options.dev) {
    let server: http.Server
    this.nuxt.hook('generate:before', async () => {
      const app = express()
      const router = express.Router()
      router.get('/api/resources/:resource', api)
      app.use('/', router)
      await new Promise<void>((resolve) => {
        server = app.listen(3000, resolve)
      })
    })
    this.nuxt.hook('generate:done', () => server?.close())
  }
}

export default buildModule
