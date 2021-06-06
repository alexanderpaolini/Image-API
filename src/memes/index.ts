import { Request, Response } from 'express'

import { API } from '../structures'

/**
 * A meme generator
 */
export interface Meme<K> {
  /**
   * Name of the meme
   */
  name: string
  /**
   * Cache
   */
  cacheResponse: boolean
  /**
   * The content type to return
   */
  contentType: string
  /**
   * Data parser
   */
  parser: (req: Request, res: Response) => any
  /**
   * Validate the data
   */
  validator: (data: K) => boolean | Promise<boolean>
  /**
   * Main function
   */
  exec: (api: API, data: K, extra: { req: Request, res: Response}) => Buffer | Promise<Buffer>
}
