import { Request, Response, NextFunction } from 'express'
import config from '../config'
import { API } from '../structures'

type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void

export default (api: API): MiddlewareFunction => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (
      req.headers.authorization === config.api.token ||
      req.query.token === config.api.token
    ) return next()
    else {
      res.status(401)
      res.send('Unauthorized')
      api.logger.warn('Request from', req.hostname, 'unauthorized')
    }
  }
}
