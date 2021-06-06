import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'chip',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (d) => d.url && typeof d.url === 'string',
  exec: async (api, { url, version }, { req, res }) => {
    const canvas = Canvas.createCanvas(2048, 2048)
    const ctx = canvas.getContext('2d')

    ctx.save()

    try {
      const avatarBuffer = await api.cache.getUserAvatar(url)
      const avatar = await Canvas.loadImage(avatarBuffer)

      ctx.beginPath()
      ctx.arc(1024, 1024, 1000, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.clip()

      ctx.drawImage(avatar, 0, 0, 2048, 2048)
    } catch { /* Voided */ }

    ctx.restore()

    const chipBuffer = await api.cache.redis.getBuffer(
      version === '2'
        ? 'chip-2'
        : 'chip-1'
    )
    const chip = await Canvas.loadImage(chipBuffer)
    ctx.drawImage(chip, 0, 0, 2048, 2048)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string, version?: string }>
