import { Canvas, loadImage } from 'skia-canvas'
import { Meme } from '.'

export default {
  name: 'invert',
  cacheResponse: false,
  contentType: 'image/png',
  parser: (req, res) => req.query,
  validator: (api, d) => api.utils.validateUrl(d.url),
  exec: async (api, { url }, { req, res }) => {
    const image = await loadImage(url)

    const canvas = new Canvas(image.width, image.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(image, 0, 0)

    ctx.globalCompositeOperation = 'difference'
    ctx.fillStyle = 'white'

    ctx.fillRect(0, 0, canvas.width, canvas.height)

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
