import { Meme } from '.'

export default {
  name: 'what',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => api.utils.validateUrl(d.url),
  exec: async (api, { url }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('what')

    await api.utils.drawImageFromUrl(ctx, url, 45, 45, 882, 702)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
