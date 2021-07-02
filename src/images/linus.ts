import { Meme } from '.'

export default {
  name: 'linus',
  cacheResponse: false,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: () => true,
  exec: async (api, { text1, text2 }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('linus')
    ctx.font = '48px Arial'

    api.utils.drawText(ctx, 329, 35, 626, 299, text1 || '', 42)
    api.utils.drawText(ctx, 329, 369, 626, 640, text2 || '', 42)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ text1: string, text2: string }>
