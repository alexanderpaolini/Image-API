import fetch from 'node-fetch'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Utils {
  /**
   * Fetch a buffer
   * @param path The image path
   * @returns The image buffer
   */
  async fetchBuffer (path: string): Promise<Buffer> {
    const res = await fetch(path)

    const buffer = await res.buffer()

    return buffer
  }
}
