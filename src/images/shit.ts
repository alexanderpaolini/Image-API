import { Meme } from '.'

export default {
  name: 'shit',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => d.url && typeof d.url === 'string' && api.utils.validateUrl(d.url),
  exec: async (api, { url }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('shit')

    await api.utils.drawImageFromUrl(ctx, url, 200, 360, 100, 100)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
