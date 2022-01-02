import config from '../config'

import fs from 'fs'
import path from 'path'
import express from 'express'

import { createLogger, transports, format } from 'winston'

import { LoadRoutes as loadRoutes } from '@jpbberry/load-routes'

import { Utils } from '../utils'

import { Cache } from './Cache'

import authentication from '../middlewares/authentication'

export class API {
  config = config

  app = express()

  logger = createLogger({
    level: 'silly',
    format: format.combine(
      format.colorize({ colors: { info: 'blue', debug: 'magenta', warn: 'yellow', error: 'red', silly: 'rainbow' }, level: true }),
      format.label({ label: 'API' }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf((info) => `[${info.label as string}] [${info.level}]: ${info.stack ? info.stack : info.message}`)
    ),
    transports: [
      new transports.Console()
    ]
  })

  utils = new Utils(this)
  cache = new Cache(this)

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
      this.logger.info('Started on port: %i', this.config.api.port)
    })
  }

  async cacheImages (): Promise<void> {
    const files = fs.readdirSync(path.resolve(__dirname, '../../images/'), { withFileTypes: true })
    for (const file of files) {
      if (!file.name.endsWith('.png')) continue

      const buffer = fs.readFileSync(path.resolve(__dirname, '../../images/', file.name))

      this.logger.debug('Cached image %s', file.name)
      await this.cache.redis.setBuffer(file.name.split('.')[0], buffer)
    }
  }
}
