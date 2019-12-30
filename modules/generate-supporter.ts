import * as http from 'http'
import { Module } from '@nuxt/types'
import express from 'express'
import api from '../api'

const buildModule: Module<never> = function() {
  let server: http.Server
  this.nuxt.hook('generate:before', () => {
    const app = express()
    app.use('/api', api.handler)
    server = app.listen(3000)
  })
  this.nuxt.hook('generate:done', () => server?.close())
}

export default buildModule
