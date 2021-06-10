import fetch from 'node-fetch'
import Canvas from 'canvas'

import { API } from '../structures'

export class Utils {
  urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/

  constructor (private readonly api: API) { }
  /**
   * Fetch a buffer
   * @param path The image path
   * @returns The image buffer
   */
  async fetchBuffer (path: string): Promise<Buffer> {
    this.api.logger.debug('Fetching URL:', path)
    const res = await fetch(path)

    const buffer = await res.buffer()

    return buffer
  }

  drawText (ctx: Canvas.NodeCanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, text: string, height: number): void {
    let line = ''
    const words = text.split(' ')

    for (let i = 0; i < words.length + 1; i++) {
      if (startY + height > endY) return

      const testLine = line + (words[i] ?? '') + ' '
      const width = ctx.measureText(testLine).width

      if (line && (width > (endX - startX) || i === words.length)) {
        if (ctx.measureText(line).width > endX - startX) {
          let endStr = ''
          const lineLen = line.length

          for (let j = 0; j < lineLen + 1; j++) {
            if (startY > endY) return
            if (ctx.measureText(endStr + line[j]).width > (endX - startX) || j === lineLen) {
              if (endStr.trim()) {
                ctx.fillText(endStr, startX, startY)
                startY = startY + height
              }
              endStr = ''
            } else endStr = endStr + line[j]
          }

          line = words[i] + ' '
          continue
        }

        if (line) ctx.fillText(line, startX, startY)

        line = words[i] + ' '
        startY = startY + height
      } else line = testLine
    }
  }

  /**
   * Generate a canvas from a pre-existing format
   * @param pregen String yes that thing
   */
  async generateCanvas (pregen: string): Promise<{
    canvas: Canvas.Canvas
    ctx: Canvas.NodeCanvasRenderingContext2D
  }> {
    const buffer = await this.api.cache.redis.getBuffer(pregen)
    const image = await Canvas.loadImage(buffer)

    const canvas = Canvas.createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(image, 0, 0, image.width, image.height)

    return { canvas, ctx }
  }

  /**
   * Draw the avatar on the canvas
   * @param ctx The Canvas ctx
   * @param url The avatar URL
   * @param startX The X it starts at
   * @param startY The Y it starts at
   * @param width Width
   * @param height Height
   */
  async drawAvatarFromUrl (
    ctx: Canvas.NodeCanvasRenderingContext2D,
    url: string,
    startX: number,
    startY: number,
    width: number,
    height: number
  ): Promise<void> {
    try {
      const avatarBuffer = await this.api.cache.getAvatar(url)
      const avatar = await Canvas.loadImage(avatarBuffer)

      ctx.drawImage(avatar, startX, startY, width, height)
    } catch (err) {
      this.api.logger.error('Error occured when drawing avatar:\n', err)
    }
  }

  /**
   * Draw the avatar on the canvas
   * @param ctx The Canvas ctx
   * @param bufferName The avatar URL
   * @param startX The X it starts at
   * @param startY The Y it starts at
   * @param width Width
   * @param height Height
   */
  async drawImageFromRedisBuffer (
    ctx: Canvas.NodeCanvasRenderingContext2D,
    bufferName: string,
    startX: number,
    startY: number,
    width: number,
    height: number
  ): Promise<void> {
    try {
      const buffer = await this.api.cache.redis.getBuffer(bufferName)
      const image = await Canvas.loadImage(buffer)

      ctx.drawImage(image, startX, startY, width, height)
    } catch (err) {
      this.api.logger.error('Error coccured when drawing avatar:\n', err)
    }
  }

  /**
   * Validate a URL
   * @param url The URL to test
   */
  validateUrl (url: string): boolean {
    return this.urlRegex.test(url)
  }

  /**
   * Clear the canvas
   * @param ctx Canvas CTX
   * @param width How long
   * @param height How high
   */
  clearCanvasCtx (ctx: Canvas.CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)

    for (let j = 0; j < imageData.data.length; j += 4) {
      imageData.data[j] = 64
      imageData.data[j + 1] = 40
      imageData.data[j + 2] = 20
      imageData.data[j + 3] = 0
    }

    ctx.putImageData(imageData, 0, 0)
  }

  drawImageWithRotation (
    ctx: Canvas.CanvasRenderingContext2D,
    img: Canvas.Image,
    x: number,
    y: number,
    width: number,
    height: number,
    deg?: number,
    flip?: any,
    flop?: any
  ): void {
    ctx.save()

    if (typeof width === 'undefined') width = img.width
    if (typeof height === 'undefined') height = img.height

    // Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2)

    // Rotate the canvas around the origin
    if (deg) {
      const rad = 2 * Math.PI - deg * Math.PI / 180
      ctx.rotate(rad)
    }

    // Flip the canvas
    let flipScale
    if (flip) flipScale = -1; else flipScale = 1

    // Flop the canvas
    let flopScale
    if (flop) flopScale = -1; else flopScale = 1
    ctx.scale(flipScale, flopScale)

    // Draw the image
    ctx.drawImage(img, -1 * width / 2, -1 * height / 2, width, height)

    ctx.restore()
  }
}
