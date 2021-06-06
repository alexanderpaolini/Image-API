import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'ussr',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (d) => d.url && typeof d.url === 'string',
  exec: async (api, { url }, { req, res }) => {
    const canvas = Canvas.createCanvas(1024, 1024)
    const ctx = canvas.getContext('2d')

    try {
      const avatarBuffer = await api.cache.getUserAvatar(url)
      const avatar = await Canvas.loadImage(avatarBuffer)
      ctx.drawImage(avatar, 0, 0, 1024, 1024)
    } catch { /* Voided */ }

    const ussrBuffer = await api.cache.redis.getBuffer('ussr')
    const ussr = await Canvas.loadImage(ussrBuffer)
    ctx.drawImage(ussr, 0, 0, 1024, 1024)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
