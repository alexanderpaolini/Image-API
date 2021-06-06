import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'teapot',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (d) => d.url && typeof d.url === 'string',
  exec: async (api, { url }, { req, res }) => {
    const canvas = Canvas.createCanvas(243, 208)
    const ctx = canvas.getContext('2d')

    const teacupBuffer = await api.cache.redis.getBuffer('teacup')
    const teacup = await Canvas.loadImage(teacupBuffer)
    ctx.drawImage(teacup, 0, 0, 243, 208)

    try {
      const avatarBuffer = await api.cache.getUserAvatar(url)
      const avatar = await Canvas.loadImage(avatarBuffer)
      ctx.drawImage(avatar, 90, 70, 75, 77)
    } catch { /* Voided */ }

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
