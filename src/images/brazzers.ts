import { Canvas, loadImage } from 'skia-canvas'

import { Meme } from '.'

const SIZE_PERCENTAGE = 0.02
const IMAGE_RATIO = 0.01

export default {
  name: 'brazzers',
  cacheResponse: true,
  contentType: 'image/png',
  parser: (req, _res) => req.query,
  validator: (api, d) => d.url && typeof d.url === 'string' && api.utils.validateUrl(d.url),
  exec: async (api, { url }, { req, res }) => {
    const image = await loadImage(url)

    const canvas = new Canvas(image.width, image.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(image, 0, 0, image.width, image.height)

    const buffer = await api.cache.redis.getBuffer('brazzers')
    const brazzersImage = await loadImage(buffer)

    const height = IMAGE_RATIO * image.width * (brazzersImage.width / brazzersImage.height)
    const width = height * (brazzersImage.width / brazzersImage.height)

    ctx.drawImage(
      brazzersImage,
      SIZE_PERCENTAGE * image.width,
      image.height - (height) - (SIZE_PERCENTAGE * image.height),
      width,
      height
    )

    return canvas.toBuffer('image/png')
  }
} as Meme<{ url: string }>
