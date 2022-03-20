import { Meme } from '.'

export default {
  name: 'tomscott',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: () => true,
  exec: async (api, { text1, text2, image1, image2 }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('tomscott')
    ctx.font = '48px Arial'

    api.utils.drawText(ctx, 370, 35, 730, 475, text1 || '', 42)
    api.utils.drawText(ctx, 370, 415, 730, 986, text2 || '', 42)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ text1: string, text2: string }>
