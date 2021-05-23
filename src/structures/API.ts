import config from '../config'

import path from 'path'
import express from 'express'

import Redis from 'ioredis'
import { LoadRoutes as loadRoutes } from '@jpbberry/load-routes'

import { Utils } from '../utils'

export class API {
  config = config

  app = express()

  logger = console
  redis = new Redis(this.config.redis)
  utils = new Utils()

  constructor () {
    this.app.set('trust-proxy', true)

    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())

    // This must be last
    loadRoutes(this.app, path.join(__dirname, '../routes'), this)

    this.app.listen(this.config.api.port, () => {
      this.logger.log('Started on port:', this.config.api.port)
    })
  }
}
