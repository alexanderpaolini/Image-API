import fs from 'fs'
import path from 'path'

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
    const meme = require(dir + '/' + file.name).default
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
    this.logger.debug('Parsed request for:', meme.name)
    const validated = await meme.validator(this, data)

    if (!validated) {
      this.logger.debug('Invalid request for:', meme.name)
      res.status(400)
      res.send('Invalid Arguments')
      return
    } else this.logger.debug('Valiated request for:', meme.name)

    const str = meme.name + '.' + JSON.stringify(data)

    const cachedMeme = await this.cache.getImage(str)
    if (cachedMeme) {
      res.status(200)
      res.contentType(meme.contentType)
      res.send(cachedMeme)
      this.logger.log('Sent meme', meme.name, 'to', req.hostname)
      return
    }

    let buffer!: Buffer
    try {
      buffer = await meme.exec(this, data, { req, res })
    } catch (err) {
      this.logger.error('Error occured while running image', meme.name, '\n', err)
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

    this.logger.log('Sent meme', meme.name, 'to', req.hostname)

    if (meme.cacheResponse) await this.cache.cacheImage(str, buffer)
  })
}