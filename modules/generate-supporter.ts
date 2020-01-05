import * as http from 'http'
import { Module } from '@nuxt/types'
import express from 'express'
import api from '../api'

const buildModule: Module<never> = function() {
  let server: http.Server
  this.nuxt.hook('generate:before', async () => {
    const app = express()
    app.use('/api', api.handler)
    await new Promise((resolve) => {
      server = app.listen(0, (err) => {
        if (err) console.error(err)
        resolve()
      })
    })
  })
  this.nuxt.hook('generate:done', () => server?.close())
}

export default buildModule
