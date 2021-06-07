import { Meme } from '.'

export default {
  name: 'drake',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: () => true,
  exec: async (api, { text1, text2 }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('drake')
    ctx.font = '48px Arial'

    api.utils.drawText(ctx, 537, 50, 937, 475, text1 || '', 42)
    api.utils.drawText(ctx, 537, 562, 937, 986, text2 || '', 42)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ text1: string, text2: string }>
