import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'sus',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => d.url && typeof d.url === 'string' && api.utils.validateUrl(d.url),
  exec: async (api, { url, version }, { req, res }) => {
    const canvas = Canvas.createCanvas(3070, 3070)
    const ctx = canvas.getContext('2d')

    ctx.save()

    ctx.beginPath()
    ctx.arc(1900, 900, 500, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()

    await api.utils.drawAvatarFromUrl(ctx, url, 1373, 400, 1051, 1051)

    ctx.restore()

    await api.utils.drawImageFromRedisBuffer(ctx, 'sus', 0, 0, 3070, 3070)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string, version?: string }>
