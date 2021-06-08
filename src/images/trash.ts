import { Meme } from '.'

export default {
  name: 'trash',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => d.url1 &&
    d.url2 &&
    typeof d.url1 === 'string' &&
    api.utils.validateUrl(d.url1) &&
    typeof d.url2 === 'string' &&
    api.utils.validateUrl(d.url2),
  exec: async (api, { url1, url2 }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('trash')

    await api.utils.drawAvatarFromUrl(ctx, url1, 115, 190, 160, 160)

    ctx.rotate(Math.PI * 0.03 * -1)

    await api.utils.drawAvatarFromUrl(ctx, url2, 360, 150, 160, 160)

    ctx.rotate(Math.PI * 0.03)

    await api.utils.drawImageFromRedisBuffer(ctx, 'trash-overlay', 0, 0, 680, 697)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url1: string, url2: string }>
