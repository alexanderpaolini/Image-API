import fs from 'fs'
import path from 'path'

import { performance } from 'perf_hooks'

import { Router } from 'express'

import { API } from '../structures/API'

import { Meme } from '../images'

export default function (this: API, router: Router): void {
  const memes: Array<Meme<any>> = []
  const dir = path.resolve(__dirname, '../images')

  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    if (!file.isFile() || !file.name.endsWith('.js')) continue
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const meme: Meme<any> = require(dir + '/' + file.name).default
    if (meme) memes.push(meme)
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('*', async (req, res) => {
    const route = req.url.slice(1).split('?')[0]
    const meme = memes.find(m => m.name === route)
    if (!meme) {
      res.status(404)
      res.end()
      return
    }

    const data = meme.parser(req, res)
    this.logger.debug('Parsed request for: %s', meme.name)
    const validated = await meme.validator(this, data)

    if (!validated) {
      this.logger.debug('Invalid request for: %s', meme.name)
      res.status(400)
      if (req.headers.always_use_image) {
        const buffer = await this.cache.getImage('oops')
        res.contentType('image/png')
        res.send(buffer)
      } else res.send('Invalid Arguments')
      return
    } else this.logger.debug('Validated request for: %s', meme.name)

    delete data.token
    const str = meme.name + '.' + JSON.stringify(data)

    const cachedMeme = await this.cache.getImage(str)
    if (cachedMeme) {
      res.status(200)
      res.contentType(meme.contentType)
      res.send(cachedMeme)
      this.logger.info('Sent meme %s to %s', meme.name, req.hostname)
      return
    }

    let buffer!: Buffer
    try {
      const now = performance.now()
      buffer = await meme.exec(this, data, { req, res })
      this.logger.debug('Ran image %s in %s', meme.name, (performance.now() - now).toFixed(2) + 'ms')
    } catch (err) {
      this.logger.error(err)
    }

    if (!Buffer.isBuffer(buffer)) {
      res.status(500)
      res.contentType('text')
      res.send('Internal Server Error')
      return
    }

    res.status(200)
    res.contentType(meme.contentType)
    res.send(buffer)

    this.logger.info('Sent meme %s to %s', meme.name, req.hostname)

    if (meme.cacheResponse) await this.cache.cacheImage(str, buffer)
  })
}
