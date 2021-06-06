import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'tomscott',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: () => true,
  exec: async (api, { text1, text2 }, { req, res }) => {
    const canvas = Canvas.createCanvas(1024, 1024)
    const ctx = canvas.getContext('2d')
    ctx.font = '48px Arial'

    const tomscottBuffer = await api.cache.redis.getBuffer('tomscott')
    const tomscott = await Canvas.loadImage(tomscottBuffer)
    ctx.drawImage(tomscott, 0, 0, 1024, 1024)

    api.utils.drawText(ctx, 537, 50, 937, 475, text1 || '', 42)
    api.utils.drawText(ctx, 537, 562, 937, 986, text2 || '', 42)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ text1: string, text2: string }>
