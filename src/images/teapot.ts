import { Meme } from '.'

export default {
  name: 'teapot',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => api.utils.validateUrl(d.url),
  exec: async (api, { url }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('teapot')

    await api.utils.drawImageFromUrl(ctx, url, 83, 81, 75, 77)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
