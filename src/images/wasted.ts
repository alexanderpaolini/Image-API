import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'wasted',
  cacheResponse: false,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => d.url && typeof d.url === 'string' && api.utils.validateUrl(d.url),
  exec: async (api, { url, version }, { req, res }) => {
    const canvas = Canvas.createCanvas(2048, 2048)
    const ctx = canvas.getContext('2d')

    await api.utils.drawAvatarFromUrl(ctx, url, 0, 0, 2048, 2048)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, 2048, 2048)

    await api.utils.drawImageFromRedisBuffer(ctx, 'wasted', 512, 512, 1024, 1024)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string, version?: string }>
