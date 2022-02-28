import { Canvas } from 'skia-canvas'
import { Meme } from '.'

export default {
    name: 'homework',
    cacheResponse: false,
    contentType: 'image/png',
    parser: (req, res) => req.query,
    validator: (api, d) => d.url1 &&
        d.url2 && d.url3 && d.url4 && d.url5 && d.url6 &&
        typeof d.url1 === 'string' &&
        api.utils.validateUrl(d.url1) &&
        typeof d.url2 === 'string' &&
        api.utils.validateUrl(d.url2) &&
        typeof d.url3 === 'string' &&
        api.utils.validateUrl(d.url3) &&
        typeof d.url4 === 'string' &&
        api.utils.validateUrl(d.url4) &&
        typeof d.url5 === 'string' &&
        api.utils.validateUrl(d.url5) &&
        typeof d.url6 === 'string' &&
        api.utils.validateUrl(d.url6),
    exec: async (api, { url1, url2, url3, url4, url5, url6 }, { req, res }) => {
        const canvas = new Canvas(750, 918)
        const ctx = canvas.getContext('2d')

        await api.utils.drawImageFromRedisBuffer(ctx, 'homework', 0, 0, 750, 918)

        await api.utils.drawAvatarFromUrl(ctx, url1, 271, 76, 128, 128)
        await api.utils.drawAvatarFromUrl(ctx, url2, 271, 221, 128, 128)
        await api.utils.drawAvatarFromUrl(ctx, url3, 271, 366, 128, 128)
        await api.utils.drawAvatarFromUrl(ctx, url4, 271, 511, 128, 128)
        await api.utils.drawAvatarFromUrl(ctx, url5, 271, 656, 128, 128)
        await api.utils.drawAvatarFromUrl(ctx, url6, 271, 801, 128, 128)

        return canvas.toBuffer('image/png')
    }
} as Meme<{ url1: string, url2: string, url3: string, url4: string, url5: string, url6: string }>
