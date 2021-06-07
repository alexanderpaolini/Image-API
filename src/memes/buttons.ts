import { Meme } from '.'

export default {
  name: 'buttons',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: () => true,
  exec: async (api, { text1, text2 }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('buttons')
    ctx.font = '20px Arial'

    ctx.rotate(Math.PI * 0.1 * -1)

    api.utils.drawText(ctx, 10, 160, 190, 250, text1 || '', 20)
    api.utils.drawText(ctx, 235, 185, 380, 280, text2 || '', 20)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ text1: string, text2: string }>
