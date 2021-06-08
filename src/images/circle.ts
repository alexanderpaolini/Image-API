import Canvas from 'canvas'

import { Meme } from '.'

export default {
  name: 'circle',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => d.url && typeof d.url === 'string' && api.utils.validateUrl(d.url),
  exec: async (api, { url }, { req, res }) => {
    const image = await Canvas.loadImage(url)
    const canvas = Canvas.createCanvas(image.height, image.width)
    const ctx = canvas.getContext('2d')

    ctx.arc(image.width / 2, image.height / 2, (image.width + image.width) / 4, 0, Math.PI * 2)

    ctx.clip()

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
