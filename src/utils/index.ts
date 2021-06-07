import fetch from 'node-fetch'
import Canvas from 'canvas'

import { API } from '../structures'

export class Utils {
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
  async drawAvatar (
    ctx: Canvas.NodeCanvasRenderingContext2D,
    url: string,
    startX: number,
    startY: number,
    width: number,
    height: number
  ): Promise<void> {
    try {
      const avatarBuffer = await this.api.cache.getUserAvatar(url)
      const avatar = await Canvas.loadImage(avatarBuffer)

      ctx.drawImage(avatar, startX, startY, width, height)
    } catch (err) {
      this.api.logger.error('Error occured when drawing avatar:\n', err)
    }
  }
}
