import { Meme } from '.'

export default {
  name: 'tomscott',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) =>
    (d.image1 ? api.utils.validateUrl(d.image1) : true) &&
    (d.image2 ? api.utils.validateUrl(d.image2) : true),
  exec: async (api, { text1, text2, image1, image2 }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('tomscott')
    ctx.font = '48px Arial'

    if (image1) {
      await api.utils.drawImageFromUrl(ctx, image1, 365, 0, 365, 365)
    } else {
      api.utils.drawText(ctx, 370, 35, 730, 475, text1 || '', 42)
    }

    if (image2) {
      await api.utils.drawImageFromUrl(ctx, image2, 365, 366, 365, 365)
    } else {
      api.utils.drawText(ctx, 370, 415, 730, 986, text2 || '', 42)
    }

    return canvas.toBuffer('image/png')
  }
} as Meme<{ text1: string, text2: string, image1: string, image2: string }>
