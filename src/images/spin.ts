// @ts-expect-error
import GIFEncoder from 'gif-encoder-2'

import { Canvas, loadImage } from 'skia-canvas'

import { Meme } from '.'

const ANGLES = 50

export default {
  name: 'spin',
  cacheResponse: true,
  contentType: 'image/gif',
  parser: (req, res) => req.query,
  validator: (api, d) => d.url && typeof d.url === 'string' && api.utils.validateUrl(d.url),
  exec: async (api, { url, angles }, { req, res }) => {
    const width = 512
    const height = 512
    const numAngles = angles ? Number(angles) : ANGLES

    const image = await loadImage(url)
    const canvas = new Canvas(width, height)

    const ctx = canvas.getContext('2d')

    ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2)
    ctx.clip()

    const encoder = new GIFEncoder(width, width)
    encoder.setTransparent(0x402814)

    encoder.start()
    encoder.setRepeat(0)
    encoder.setDelay(15)

    const centerX = width / 2
    const centerY = height / 2

    ctx.drawImage(image, 0, 0, width, height)

    for (let i = 0; i <= numAngles; i++) {
      encoder.addFrame(ctx)

      ctx.translate(centerX, centerY)

      ctx.rotate((Math.PI * 2) / numAngles)

      ctx.translate(-centerX, -centerY)

      api.utils.clearCanvasCtx(ctx, width, width)

      ctx.drawImage(image, 0, 0, width, height)
    }

    encoder.finish()

    return encoder.out.getData()
  }
} as Meme<{ url: string, angles: string }>
