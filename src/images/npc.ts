
import { Meme } from '.'
import { Canvas } from 'skia-canvas'

export default {
    name: 'npc',
    cacheResponse: true,
    contentType: 'image/png',
    parser: (req, res) => req.query,
    validator: (api, d) => api.utils.validateUrl(d.url),
    exec: async (api, { url, version }, { req, res }) => {
        const canvas = new Canvas(636, 773)
        const ctx = canvas.getContext('2d')

        await api.utils.drawImageFromRedisKey(ctx, 'npc', 0, 0, 636, 773)

        await api.utils.drawImageFromUrl(ctx, url, 160, 160, 536, 536)

        return canvas.toBuffer('image/png')
    }
} as Meme<{ url: string, version?: string }>
