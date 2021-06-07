import { Meme } from '.'

export default {
  name: 'teapot',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (d) => d.url && typeof d.url === 'string',
  exec: async (api, { url }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('teapot')

    await api.utils.drawAvatar(ctx, url, 90, 70, 75, 77)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
