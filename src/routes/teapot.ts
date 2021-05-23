import { Router } from 'express'

import { API } from '../structures/API'

export default function (this: API, router: Router): void {
  router.get('*', (req, res) => {
    res.status(418)
    res.send('I’m a teapot.')
  })
}
