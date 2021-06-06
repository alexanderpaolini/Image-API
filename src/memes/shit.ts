import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'shit',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (d) => d.url && typeof d.url === 'string',
  exec: async (api, { url }, { req, res }) => {
    const canvas = Canvas.createCanvas(562, 562)
    const ctx = canvas.getContext('2d')

    const shitBuffer = await api.cache.redis.getBuffer('shit')
    const shit = await Canvas.loadImage(shitBuffer)
    ctx.drawImage(shit, 0, 0, 562, 562)

    try {
      const avatarBuffer = await api.cache.getUserAvatar(url)
      const avatar = await Canvas.loadImage(avatarBuffer)

      ctx.drawImage(avatar, 200, 360, 100, 100)
    } catch { /* Voided */ }

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
