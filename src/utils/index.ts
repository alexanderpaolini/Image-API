import fetch from 'node-fetch'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Utils {
  async fetchBuffer (path: string): Promise<Buffer> {
    const res = await fetch(path)

    const buffer = await res.buffer()

    return buffer
  }
}
