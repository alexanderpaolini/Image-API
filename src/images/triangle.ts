import { Canvas, loadImage } from 'skia-canvas'

import { Meme } from '.'

export default {
  name: 'triangle',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => d.url && typeof d.url === 'string' && api.utils.validateUrl(d.url),
  exec: async (api, { url }, { req, res }) => {
    const image = await loadImage(url)
    const canvas = new Canvas(image.width, image.height)
    const ctx = canvas.getContext('2d')

    ctx.moveTo(image.width / 2, 0)

    ctx.lineTo(image.width, image.height)
    ctx.lineTo(0, image.height)
    ctx.lineTo(image.width / 2, 0)

    ctx.clip()

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
