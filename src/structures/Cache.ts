import { API } from './API'

import Redis from 'ioredis'

export class Cache {
  redis = new Redis(this.api.config.redis)

  constructor (private readonly api: API) { }

  /**
   * Get a user's avatar
   * @param url The user's avatarUrl
   */
  async getAvatar (url: string): Promise<Buffer> {
    const buffer = await this.redis.getBuffer(`avatar.${url}`)
    if (!buffer) {
      const buff = await this.api.utils.fetchBuffer(url)

      await this.redis.setBuffer(`avatar.${url}`, buff, 'EX', this.api.config.ttl.avatar)
      return buff
    }
    this.api.logger.debug('Retreived avatar from cache: %s', url)
    await this.redis.expire(`avatar.${url}`, this.api.config.ttl.avatar)
    return buffer
  }

  /**
   * Cache a user's avatar
   * @param url The avatar's URL
   * @param avatar The avatar's buffer
   */
  async cacheAvatar (url: string, avatar: Buffer): Promise<void> {
    this.api.logger.debug('Cached avatar: %s', url)
    await this.redis.setBuffer(`avatar.${url}`, avatar, 'EX', this.api.config.ttl.avatar)
  }

  /**
   * Cache an image
   * @param key The key, could be anything
   * @param buffer The Buffer
   * @param ttl The time to expre (seconds)
   */
  async cacheImage (key: string, buffer: Buffer): Promise<void> {
    this.api.logger.debug('Cached image: %s', key)
    await this.redis.setBuffer(key, buffer, 'EX', 15 * 60)
  }

  /**
   * Get an image (or any buffer)
   * @param key The key, could be anything
   */
  async getImage (key: string): Promise<Buffer | null> {
    const exists = await this.redis.exists(key)
    if (exists) {
      this.api.logger.debug('Retreived image from cache: %s', key)
      const buff = await this.redis.getBuffer(key)
      await this.redis.expire(key, 15 * 60)
      return buff
    }
    return null
  }
}
