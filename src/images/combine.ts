import { Canvas } from 'skia-canvas'
import { Meme } from '.'

export default {
  name: 'combine',
  cacheResponse: false,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => api.utils.validateUrl(d.url1) && api.utils.validateUrl(d.url2),
  exec: async (api, { url1, url2 }, { req, res }) => {
    const canvas = new Canvas(1024, 1024)
    const ctx = canvas.getContext('2d')

    await api.utils.drawImageFromUrl(ctx, url1, 0, 0, 1024, 1024)

    ctx.globalAlpha = 0.5
    ctx.globalCompositeOperation = 'source-atop'

    await api.utils.drawImageFromUrl(ctx, url2, 0, 0, 1024, 1024)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url1: string, url2: string }>
