import { Meme } from '.'

export default {
  name: 'buttons',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: () => true,
  exec: async (api, { text1, text2 }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('buttons')
    ctx.font = '40px Arial'

    ctx.rotate(Math.PI * 0.1 * -1)

    api.utils.drawText(ctx, 10, 160, 190, 400, text1 || '', 30)
    api.utils.drawText(ctx, 230, 195, 380, 280, text2 || '', 30)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ text1: string, text2: string }>
