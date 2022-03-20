import { Canvas } from 'skia-canvas'
import { Meme } from '.'

export default {
  name: 'wasted',
  cacheResponse: false,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => api.utils.validateUrl(d.url),
  exec: async (api, { url, version }, { req, res }) => {
    const canvas = new Canvas(2048, 2048)
    const ctx = canvas.getContext('2d')

    await api.utils.drawImageFromUrl(ctx, url, 0, 0, 2048, 2048)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, 2048, 2048)

    await api.utils.drawImageFromRedisKey(ctx, 'wasted', 512, 512, 1024, 1024)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string, version?: string }>
