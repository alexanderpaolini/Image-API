import config from '../config'

import path from 'path'
import express from 'express'

import { LoadRoutes as loadRoutes } from '@jpbberry/load-routes'
import { RestManager } from 'discord-rose'

import { Utils } from '../utils'

import { Cache } from './Cache'
import { Logger } from './Logger'

import fs from 'fs'

import authentication from '../middlewares/authentication'

export class API {
  config = config

  app = express()

  logger = new Logger()
  utils = new Utils(this)
  cache = new Cache(this)
  discord = new RestManager(this.config.discord.token)

  constructor () {
    this.app.set('trust-proxy', true)

    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
    this.app.use('*', authentication(this))

    // This must be last
    loadRoutes(this.app, path.join(__dirname, '../routes'), this)

    // Cache some things
    void this.cacheImages()

    this.app.listen(this.config.api.port, () => {
      this.logger.log('Started on port:', this.config.api.port)
    })
  }

  async cacheImages (): Promise<void> {
    const files = fs.readdirSync(path.resolve(__dirname, '../../images/'), { withFileTypes: true })
    for (const file of files) {
      if (!file.name.endsWith('.png')) continue

      const buffer = fs.readFileSync(path.resolve(__dirname, '../../images/', file.name))

      this.logger.debug('Cached image', file.name)
      await this.cache.redis.setBuffer(file.name.split('.')[0], buffer)
    }
  }
}
