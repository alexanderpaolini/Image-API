import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'drake',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: () => true,
  exec: async (api, { text1, text2 }, { req, res }) => {
    const canvas = Canvas.createCanvas(1024, 1024)
    const ctx = canvas.getContext('2d')
    ctx.font = '48px Ariel'

    const drakeBuffer = await api.cache.redis.getBuffer('drake')
    const drake = await Canvas.loadImage(drakeBuffer)
    ctx.drawImage(drake, 0, 0, 1024, 1024)

    api.utils.drawText(ctx, 537, 50, 937, 475, text1 || '', 42)
    api.utils.drawText(ctx, 537, 562, 937, 986, text2 || '', 42)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ text1: string, text2: string }>
