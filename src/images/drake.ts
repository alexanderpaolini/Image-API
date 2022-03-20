import { Meme } from '.'

export default {
  name: 'drake',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) =>
    (d.image1 ? api.utils.validateUrl(d.image1) : true) &&
    (d.image2 ? api.utils.validateUrl(d.image2) : true),
  exec: async (api, { text1, text2, image1, image2 }, { req, res }) => {
    const { canvas, ctx } = await api.utils.generateCanvas('drake')
    ctx.font = '48px Arial'

    if (image1) {
      await api.utils.drawImageFromUrl(ctx, image1, 600, 0, 600, 600)
    } else {
      api.utils.drawText(ctx, 605, 35, 1200, 475, text1 || '', 42)
    }

    if (image2) {
      await api.utils.drawImageFromUrl(ctx, image2, 600, 600, 600, 600)
    } else {
      api.utils.drawText(ctx, 605, 635, 1200, 986, text2 || '', 42)
    }

    return canvas.toBuffer('image/png')
  }
} as Meme<{ text1: string, text2: string, image1: string, image2: string }>
