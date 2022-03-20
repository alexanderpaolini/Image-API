import { Canvas } from 'skia-canvas'
import { Meme } from '.'

export default {
  name: 'sus',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => api.utils.validateUrl(d.url),
  exec: async (api, { url, version }, { req, res }) => {
    const canvas = new Canvas(3070, 3070)
    const ctx = canvas.getContext('2d')

    ctx.save()

    ctx.beginPath()
    ctx.arc(1900, 900, 500, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()

    await api.utils.drawImageFromUrl(ctx, url, 1373, 400, 1051, 1051)

    ctx.restore()

    await api.utils.drawImageFromRedisKey(ctx, 'sus', 0, 0, 3070, 3070)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string, version?: string }>
