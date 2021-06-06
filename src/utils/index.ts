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
}
