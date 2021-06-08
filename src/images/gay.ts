import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'gay',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => d.url && typeof d.url === 'string' && api.utils.validateUrl(d.url),
  exec: async (api, { url }, { req, res }) => {
    const canvas = Canvas.createCanvas(1024, 1024)
    const ctx = canvas.getContext('2d')

    await api.utils.drawAvatarFromUrl(ctx, url, 0, 0, 1024, 1024)

    await api.utils.drawImageFromRedisBuffer(ctx, 'gay', 0, 0, 1024, 1024)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
