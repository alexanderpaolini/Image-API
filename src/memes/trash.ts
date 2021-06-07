import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'trash',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (d) => d.url1 && d.url2 && typeof d.url1 === 'string' && typeof d.url2 === 'string',
  exec: async (api, { url1, url2 }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('trash')

    await api.utils.drawAvatar(ctx, url1, 115, 190, 160, 160)

    ctx.rotate(Math.PI * 0.03 * -1)

    await api.utils.drawAvatar(ctx, url2, 360, 150, 160, 160)

    ctx.rotate(Math.PI * 0.03)

    const overlayBuffer = await api.cache.redis.getBuffer('trash-overlay')
    const overlay = await Canvas.loadImage(overlayBuffer)
    ctx.drawImage(overlay, 0, 0, 680, 697)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url1: string, url2: string }>
