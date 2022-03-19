import { Canvas } from 'skia-canvas'
import { Meme } from '.'

export default {
  name: 'chip',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => d.url && typeof d.url === 'string' && api.utils.validateUrl(d.url),
  exec: async (api, { url, version }, { req, res }) => {
    const canvas = new Canvas(2048, 2048)
    const ctx = canvas.getContext('2d')

    ctx.save()

    ctx.beginPath()
    ctx.arc(1024, 1024, 1000, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()

    await api.utils.drawImageFromUrl(ctx, url, 0, 0, 2048, 2048)

    ctx.restore()

    await api.utils.drawImageFromRedisKey(ctx,
      version === '2'
        ? 'chip-2'
        : 'chip-1',
      0,
      0,
      2048,
      2048
    )

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string, version?: string }>
