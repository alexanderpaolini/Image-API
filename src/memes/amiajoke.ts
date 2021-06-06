import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'amiajoke',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (d) => d.url && typeof d.url === 'string',
  exec: async (api, { url }, { req, res }) => {
    const canvas = Canvas.createCanvas(1920, 1411)
    const ctx = canvas.getContext('2d')

    const amiajokeBuffer = await api.cache.redis.getBuffer('amiajoke')
    const amiajoke = await Canvas.loadImage(amiajokeBuffer)
    ctx.drawImage(amiajoke, 0, 0, 1920, 1411)

    try {
      const avatarBuffer = await api.cache.getUserAvatar(url)
      const avatar = await Canvas.loadImage(avatarBuffer)

      ctx.drawImage(avatar, 900, 140, 700, 700)
    } catch { /* Voided */ }

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
