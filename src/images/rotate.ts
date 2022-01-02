// @ts-expect-error
import GIFEncoder from 'gif-encoder-2'

import { Canvas, loadImage } from 'skia-canvas'

import { Meme } from '.'

const PARTS = 22

export default {
  name: 'rotate',
  cacheResponse: true,
  contentType: 'image/gif',
  parser: (req, res) => req.query,
  validator: (api, d) => d.url && typeof d.url === 'string' && api.utils.validateUrl(d.url),
  exec: async (api, { url, angles }, { req, res }) => {
    const width = 512
    const height = 512

    const image = await loadImage(url)
    const canvas = new Canvas(width, height)

    const ctx = canvas.getContext('2d')

    const encoder = new GIFEncoder(width, width)
    encoder.setTransparent(0x402814)

    encoder.start()
    encoder.setRepeat(0)
    encoder.setDelay(30)

    for (let i = 0; i <= PARTS; i++) {
      ctx.save()

      // Reset the data
      api.utils.clearCanvasCtx(ctx, width, height)

      // Draw the image
      const wr = 10 * i
      const fw = width - (wr * 2)

      ctx.drawImage(image, wr, 0, fw, height)
      encoder.addFrame(ctx)

      ctx.restore()
    }

    for (let i = PARTS; i >= 0; i--) {
      ctx.save()

      // Reset the data
      api.utils.clearCanvasCtx(ctx, width, height)

      const wr = 10 * i
      const fw = width - (wr * 2)
      api.utils.drawImageWithRotation(ctx, image, wr, 0, fw, height, undefined, true)

      encoder.addFrame(ctx)

      ctx.restore()
    }

    for (let i = 0; i <= PARTS; i++) {
      ctx.save()

      // Reset the data
      api.utils.clearCanvasCtx(ctx, width, height)

      const wr = 10 * i
      const fw = width - (wr * 2)

      api.utils.drawImageWithRotation(ctx, image, wr, 0, fw, height, undefined, true)

      encoder.addFrame(ctx)

      ctx.restore()
    }

    for (let i = PARTS; i >= 0; i--) {
      ctx.save()

      // Reset the data
      api.utils.clearCanvasCtx(ctx, width, height)

      // Draw the image
      const wr = 10 * i
      const fw = width - (wr * 2)

      ctx.drawImage(image, wr, 0, fw, height)
      encoder.addFrame(ctx)

      ctx.restore()
    }

    encoder.finish()

    return encoder.out.getData()
  }
} as Meme<{ url: string, angles: string }>
