import { Meme } from '.'

export default {
  name: 'photograph',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => d.url && typeof d.url === 'string' && api.utils.validateUrl(d.url),
  exec: async (api, { url }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('photograph')

    ctx.rotate(-1 * Math.PI * 2 * 0.044)
    await api.utils.drawAvatarFromUrl(ctx, url, 595, 595, 375, 250)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
