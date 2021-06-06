import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'trash',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (d) => d.url1 && d.url2 && typeof d.url1 === 'string' && typeof d.url2 === 'string',
  exec: async (api, { url1, url2 }, { req, res }) => {
    const canvas = Canvas.createCanvas(680, 697)
    const ctx = canvas.getContext('2d')

    const trashBuffer = await api.cache.redis.getBuffer('trash')
    const trash = await Canvas.loadImage(trashBuffer)
    ctx.drawImage(trash, 0, 0, 680, 697)

    try {
      const avatarBuffer = await api.cache.getUserAvatar(url1)
      const avatar = await Canvas.loadImage(avatarBuffer)

      ctx.drawImage(avatar, 115, 190, 160, 160)
    } catch { /* Voided */ }

    try {
      const avatarBuffer = await api.cache.getUserAvatar(url2)
      const avatar = await Canvas.loadImage(avatarBuffer)

      ctx.rotate(Math.PI * 0.03 * -1)
      ctx.drawImage(avatar, 360, 150, 160, 160)
      ctx.rotate(Math.PI * 0.03)
    } catch { /* Voided */ }

    const overlayBuffer = await api.cache.redis.getBuffer('trash-overlay')
    const overlay = await Canvas.loadImage(overlayBuffer)
    ctx.drawImage(overlay, 0, 0, 680, 697)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url1: string, url2: string }>
